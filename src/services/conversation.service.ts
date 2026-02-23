import { Conversation, IConversation } from '../models/Conversation';
import { GeminiService } from './gemini.service';
import { WhatsAppService } from './whatsapp.service';

export class ConversationService {
  private geminiService: GeminiService;
  private whatsappService: WhatsAppService;

  constructor() {
    this.geminiService = new GeminiService();
    this.whatsappService = new WhatsAppService();
  }

  /**
   * Procesa un mensaje entrante de WhatsApp
   */
  public async processMessage(phoneNumber: string, messageText: string): Promise<void> {
    try {
      // 1. Obtener o crear conversación
      let conversation = await this.getOrCreateConversation(phoneNumber);

      // 2. Verificar si requiere escalamiento
      if (this.geminiService.shouldEscalateToHuman(messageText)) {
        await this.whatsappService.sendEscalationMessage(phoneNumber);
        await this.saveMessage(conversation, 'user', messageText);
        await this.saveMessage(
          conversation,
          'assistant',
          '[Escalado a humano - esperando respuesta del equipo médico]'
        );
        return;
      }

      // 3. Guardar mensaje del usuario
      conversation = await this.saveMessage(conversation, 'user', messageText);

      // 4. Generar respuesta con IA
      const aiResponse = await this.geminiService.generateResponse(
        messageText,
        conversation.messages
      );

      // 5. Guardar respuesta de la IA
      conversation = await this.saveMessage(conversation, 'assistant', aiResponse);

      // 6. Verificar si se completó el agendamiento
      const appointmentInfo = this.geminiService.extractAppointmentInfo(conversation.messages);
      if (
        appointmentInfo.hasName &&
        appointmentInfo.hasReason &&
        appointmentInfo.hasDate &&
        appointmentInfo.hasTime &&
        !conversation.appointmentScheduled
      ) {
        // Marcar cita como agendada
        conversation.appointmentScheduled = true;
        await conversation.save();

        // Enviar confirmación
        await this.whatsappService.sendAppointmentConfirmation(phoneNumber, {
          name: conversation.patientName,
          ...conversation.appointmentDetails,
        });

        return;
      }

      // 7. Enviar respuesta por WhatsApp
      await this.whatsappService.sendMessage(phoneNumber, aiResponse);
    } catch (error) {
      console.error('Error processing message:', error);
      // Enviar mensaje de error al usuario
      await this.whatsappService.sendMessage(
        phoneNumber,
        'Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta nuevamente o contacta directamente a la clínica.'
      );
    }
  }

  /**
   * Obtiene una conversación existente o crea una nueva
   */
  private async getOrCreateConversation(phoneNumber: string): Promise<IConversation> {
    let conversation = await Conversation.findOne({ phoneNumber });

    if (!conversation) {
      conversation = new Conversation({
        phoneNumber,
        messages: [],
        appointmentScheduled: false,
      });
      await conversation.save();
      console.log(`✅ New conversation created for ${phoneNumber}`);
    } else {
      // Actualizar última interacción
      conversation.lastInteraction = new Date();
      await conversation.save();
    }

    return conversation;
  }

  /**
   * Guarda un mensaje en la conversación
   */
  private async saveMessage(
    conversation: IConversation,
    role: 'user' | 'assistant',
    content: string
  ): Promise<IConversation> {
    conversation.messages.push({
      role,
      content,
      timestamp: new Date(),
    });

    // Limitar historial a últimos 20 mensajes (para no exceder límites de Gemini)
    if (conversation.messages.length > 20) {
      conversation.messages = conversation.messages.slice(-20);
    }

    await conversation.save();
    return conversation;
  }

  /**
   * Obtiene todas las conversaciones activas (para dashboard)
   */
  public async getActiveConversations(limit: number = 10): Promise<IConversation[]> {
    return Conversation.find()
      .sort({ lastInteraction: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Obtiene una conversación por número de teléfono
   */
  public async getConversationByPhone(phoneNumber: string): Promise<IConversation | null> {
    return Conversation.findOne({ phoneNumber });
  }
}
