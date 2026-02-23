import { Request, Response } from 'express';
import { ConversationService } from '../services/conversation.service';
import { config } from '../config';

export class HealthController {
  private conversationService: ConversationService;

  constructor() {
    this.conversationService = new ConversationService();
  }

  /**
   * Health check endpoint
   */
  public healthCheck = (req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'WhatsApp Clinic Bot',
      environment: config.nodeEnv,
    });
  };

  /**
   * Dashboard con estadísticas
   */
  public getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const conversations = await this.conversationService.getActiveConversations(10);

      const stats = {
        totalConversations: conversations.length,
        appointmentsScheduled: conversations.filter((c) => c.appointmentScheduled).length,
        activeToday: conversations.filter((c) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return c.lastInteraction >= today;
        }).length,
      };

      res.status(200).json({
        clinic: config.clinic.name,
        stats,
        recentConversations: conversations.map((c) => ({
          phoneNumber: c.phoneNumber.slice(-4), // Últimos 4 dígitos por privacidad
          patientName: c.patientName || 'N/A',
          messageCount: c.messages.length,
          appointmentScheduled: c.appointmentScheduled,
          lastInteraction: c.lastInteraction,
        })),
      });
    } catch (error) {
      console.error('Error getting dashboard:', error);
      res.status(500).json({ error: 'Failed to get dashboard data' });
    }
  };
}
