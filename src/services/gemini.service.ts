import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { IMessage } from '../models/Conversation';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  private buildSystemPrompt(): string {
    return `Eres un asistente virtual de ${config.clinic.name}, una clínica médica profesional.

TU PERSONALIDAD:
- Amable, empático y profesional
- Usas un tono cálido pero mantienes límites profesionales
- Respondes de manera concisa (máximo 3-4 líneas por mensaje)
- Nunca das diagnósticos médicos, solo información general

TUS FUNCIONES PRINCIPALES:
1. Agendar citas médicas
2. Proporcionar información sobre horarios y servicios
3. Responder preguntas generales sobre la clínica
4. Escalar a un humano cuando sea necesario

INFORMACIÓN DE LA CLÍNICA:
- Nombre: ${config.clinic.name}
- Horario: ${config.clinic.hours}
- Servicios: Consulta general, pediatría, ginecología (puedes expandir según necesites)

REGLAS IMPORTANTES:
1. Si el paciente menciona síntomas graves (dolor de pecho, dificultad respiratoria, sangrado severo), recomienda atención médica inmediata
2. Para agendar cita, necesitas: nombre completo, motivo de consulta, fecha preferida, hora preferida
3. Si no entiendes algo, pide aclaración de manera amable
4. Si el paciente está molesto o necesita hablar con un humano, confirma que lo transferirás

FORMATO DE RESPUESTAS:
- Usa emojis moderadamente (😊 ✅ 📅)
- Sé conversacional pero profesional
- Confirma siempre la información importante

EJEMPLO DE CONVERSACIÓN:
Usuario: "Hola, quiero agendar una cita"
Tú: "¡Hola! 😊 Con gusto te ayudo a agendar tu cita. ¿Me podrías decir tu nombre completo y el motivo de tu consulta?"

Usuario: "Me duele mucho el pecho"
Tú: "Entiendo tu preocupación. El dolor de pecho puede ser algo serio. Te recomiendo que acudas a urgencias de inmediato o llames al 911. ¿Necesitas que te ayude con algo más mientras tanto?"

Recuerda: Eres empático, eficiente y siempre priorizas la salud del paciente.`;
  }

  public async generateResponse(
    userMessage: string,
    conversationHistory: IMessage[]
  ): Promise<string> {
    try {
      // Construir historial de conversación en formato Gemini
      const chatHistory = conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Crear chat con historial
      const chat = this.model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 200, // Respuestas concisas
          temperature: 0.7, // Balance entre creatividad y consistencia
        },
      });

      // Si es el primer mensaje, incluir el system prompt
      let prompt = userMessage;
      if (conversationHistory.length === 0) {
        prompt = `${this.buildSystemPrompt()}\n\nPaciente: ${userMessage}`;
      }

      const result = await chat.sendMessage(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Detecta si el mensaje requiere escalamiento a humano
   */
  public shouldEscalateToHuman(userMessage: string): boolean {
    const escalationKeywords = [
      'hablar con doctor',
      'hablar con médico',
      'quiero hablar con alguien',
      'necesito ayuda urgente',
      'estoy molesto',
      'queja',
      'no entiendes',
    ];

    const messageLower = userMessage.toLowerCase();
    return escalationKeywords.some((keyword) => messageLower.includes(keyword));
  }

  /**
   * Extrae información de cita del contexto
   */
  public extractAppointmentInfo(messages: IMessage[]): {
    hasName: boolean;
    hasReason: boolean;
    hasDate: boolean;
    hasTime: boolean;
  } {
    const fullConversation = messages.map((m) => m.content).join(' ').toLowerCase();

    return {
      hasName: /nombre|me llamo|soy/.test(fullConversation),
      hasReason: /motivo|consulta|dolor|síntoma/.test(fullConversation),
      hasDate: /\d{1,2}[\/\-]\d{1,2}|\d{1,2} de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|lunes|martes|miércoles|jueves|viernes/.test(
        fullConversation
      ),
      hasTime: /\d{1,2}:\d{2}|mañana|tarde|\d{1,2} (am|pm)/.test(fullConversation),
    };
  }
}
