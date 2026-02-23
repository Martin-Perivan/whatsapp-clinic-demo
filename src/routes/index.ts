import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const webhookController = new WebhookController();
const healthController = new HealthController();

// Health check
router.get('/health', healthController.healthCheck);

// Dashboard (para ver estadísticas)
router.get('/dashboard', healthController.getDashboard);

// WhatsApp webhook verification (GET)
router.get('/webhook', webhookController.verify);

// WhatsApp webhook receive messages (POST)
router.post('/webhook', webhookController.receive);

export default router;
