import { Request, Response } from 'express';
import { config } from '../config';
import { ConversationService } from '../services/conversation.service';
import { WhatsAppService } from '../services/whatsapp.service';

export class WebhookController {
  private conversationService: ConversationService;
  private whatsappService: WhatsAppService;

  constructor() {
    this.conversationService = new ConversationService();
    this.whatsappService = new WhatsAppService();
  }

  /**
   * Verificación del webhook (GET request de Meta)
   */
  public verify = (req: Request, res: Response): void => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('📞 Webhook verification attempt:', { mode, token });

    if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
      console.log('✅ Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.error('❌ Webhook verification failed');
      res.sendStatus(403);
    }
  };

  /**
   * Recepción de mensajes (POST request de Meta)
   */
  public receive = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;

      // Responder rápido a Meta (requerimiento de la API)
      res.sendStatus(200);

      // Verificar que sea un evento de WhatsApp
      if (body.object !== 'whatsapp_business_account') {
        console.log('⚠️  Not a WhatsApp event');
        return;
      }

      // Procesar cada entrada
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field !== 'messages') continue;

          const value = change.value;

          // Ignorar mensajes de estado (enviados, entregados, leídos)
          if (value.statuses) continue;

          // Procesar solo mensajes nuevos
          if (!value.messages) continue;

          for (const message of value.messages) {
            // Ignorar mensajes que no sean de texto
            if (message.type !== 'text') {
              console.log(`⚠️  Received non-text message type: ${message.type}`);
              continue;
            }

            const phoneNumber = message.from;
            const messageText = message.text.body;
            const messageId = message.id;

            console.log(`📨 New message from ${phoneNumber}: "${messageText}"`);

            // Marcar como leído
            await this.whatsappService.markAsRead(messageId);

            // Procesar el mensaje (esto corre async, no bloqueante)
            this.conversationService.processMessage(phoneNumber, messageText).catch((error) => {
              console.error('Error processing message async:', error);
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in webhook receive:', error);
      // Ya respondimos 200, así que no hacemos res.status aquí
    }
  };
}
