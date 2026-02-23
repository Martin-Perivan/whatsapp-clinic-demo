import axios from 'axios';
import { config } from '../config';

export class WhatsAppService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = `${config.whatsapp.apiUrl}/${config.whatsapp.phoneId}/messages`;
  }

  /**
   * Envía un mensaje de texto a través de WhatsApp Cloud API
   */
  public async sendMessage(to: string, message: string): Promise<void> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: {
            body: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${config.whatsapp.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Message sent to ${to}:`, response.data);
    } catch (error: any) {
      console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp message');
    }
  }

  /**
   * Marca un mensaje como leído
   */
  public async markAsRead(messageId: string): Promise<void> {
    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${config.whatsapp.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      // No es crítico si falla
      console.warn('Warning: Failed to mark message as read');
    }
  }

  /**
   * Envía mensaje de transferencia a humano
   */
  public async sendEscalationMessage(to: string): Promise<void> {
    const message = `Entiendo que necesitas hablar con una persona. 👨‍⚕️

Un miembro de nuestro equipo te contactará pronto por este mismo medio.

Horario de atención: ${config.clinic.hours}

Gracias por tu paciencia. 🙏`;

    await this.sendMessage(to, message);
  }

  /**
   * Envía confirmación de cita
   */
  public async sendAppointmentConfirmation(
    to: string,
    appointmentDetails: {
      name?: string;
      date?: string;
      time?: string;
      reason?: string;
    }
  ): Promise<void> {
    const { name, date, time, reason } = appointmentDetails;

    const message = `✅ ¡Cita agendada exitosamente!

📋 Detalles:
${name ? `• Paciente: ${name}` : ''}
${reason ? `• Motivo: ${reason}` : ''}
${date ? `• Fecha: ${date}` : ''}
${time ? `• Hora: ${time}` : ''}

Un miembro de nuestro equipo confirmará tu cita pronto. 

📞 Si necesitas cambiar tu cita, escríbenos.

¡Nos vemos pronto! 😊`;

    await this.sendMessage(to, message);
  }
}
