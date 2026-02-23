import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongodb: {
    uri: string;
  };
  whatsapp: {
    token: string;
    phoneId: string;
    verifyToken: string;
    apiUrl: string;
  };
  gemini: {
    apiKey: string;
  };
  clinic: {
    name: string;
    hours: string;
  };
}

const requiredEnvVars = [
  'MONGODB_URI',
  'WHATSAPP_TOKEN',
  'WHATSAPP_PHONE_ID',
  'WHATSAPP_VERIFY_TOKEN',
  'GEMINI_API_KEY',
];

// Validar variables de entorno requeridas
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI!,
  },
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN!,
    phoneId: process.env.WHATSAPP_PHONE_ID!,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN!,
    apiUrl: 'https://graph.facebook.com/v18.0',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY!,
  },
  clinic: {
    name: process.env.CLINIC_NAME || 'Clínica Demo',
    hours: process.env.CLINIC_HOURS || 'Lunes a Viernes 9:00 AM - 6:00 PM',
  },
};
