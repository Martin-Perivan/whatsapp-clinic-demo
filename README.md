# 🏥 WhatsApp Clinic Bot - Demo

Automatización de WhatsApp para clínicas médicas con IA. Agenda citas, responde preguntas y escala a humanos cuando es necesario.

## 🚀 Stack Tecnológico

- **Backend:** Node.js 20 + TypeScript + Express
- **Base de datos:** MongoDB Atlas (free tier)
- **IA:** Google Gemini 2.0 Flash
- **Mensajería:** WhatsApp Cloud API (Meta)
- **Deployment:** Railway

## ✨ Características

✅ Responde automáticamente 24/7  
✅ Agenda citas médicas  
✅ Guarda contexto de conversaciones  
✅ Escalamiento inteligente a humano  
✅ Dashboard de estadísticas  
✅ Producción-ready con MongoDB  

## 📋 Prerequisitos

1. **Node.js 20+** - [Descargar](https://nodejs.org/)
2. **pnpm 9+** - Instalación:
   ```bash
   npm install -g pnpm
   # O con corepack (incluido en Node.js 16+)
   corepack enable
   corepack prepare pnpm@latest --activate
   ```
3. **MongoDB Atlas** - [Cuenta gratis](https://www.mongodb.com/cloud/atlas/register)
4. **Meta Developer Account** - [Crear cuenta](https://developers.facebook.com/)
5. **Google AI API Key** - [Obtener key](https://aistudio.google.com/)
6. **Railway Account** - [Registrarse](https://railway.app/)

## 🛠️ Instalación Local

### Opción 1: Setup automático (recomendado)

```bash
# Clonar repositorio
git clone <tu-repo>
cd whatsapp-clinic-demo

# Ejecutar script de setup (instala pnpm si es necesario)
chmod +x setup.sh
./setup.sh
```

El script verificará e instalará automáticamente:
- ✅ Node.js 20+ (verificación)
- ✅ pnpm 9+ (instalación si es necesario)
- ✅ Dependencias del proyecto

### Opción 2: Setup manual

### 1. Clonar repositorio

```bash
git clone <tu-repo>
cd whatsapp-clinic-demo
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y completa:

```bash
cp .env.example .env
```

Edita `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB Atlas (obtén tu URI de MongoDB Atlas)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/whatsapp-clinic

# WhatsApp Cloud API (obtén de Meta Developer Console)
WHATSAPP_TOKEN=tu_access_token
WHATSAPP_PHONE_ID=tu_phone_number_id
WHATSAPP_VERIFY_TOKEN=mi_secreto_123

# Google Gemini
GEMINI_API_KEY=tu_api_key

# Clínica (personalizable)
CLINIC_NAME=Clínica Demo
CLINIC_HOURS=Lunes a Viernes 9:00 AM - 6:00 PM
```

### 4. Ejecutar en desarrollo

```bash
pnpm dev
```

Deberías ver:

```
╔════════════════════════════════════════════╗
║  🏥 WhatsApp Clinic Bot                   ║
║  ✅ Server running on port 3000           ║
║  ✅ MongoDB connected                      ║
╚════════════════════════════════════════════╝
```

## 📡 Configurar WhatsApp Cloud API

### 1. Crear App en Meta

1. Ve a [Meta Developer Console](https://developers.facebook.com/)
2. Crear nueva app → Tipo: "Business"
3. Agregar producto → "WhatsApp"

### 2. Obtener credenciales

En la configuración de WhatsApp encontrarás:

- **WHATSAPP_TOKEN**: Access Token (temporal para pruebas)
- **WHATSAPP_PHONE_ID**: Phone Number ID
- **WHATSAPP_VERIFY_TOKEN**: Crea uno tú (cualquier string secreto)

### 3. Agregar números de prueba

1. En WhatsApp → "API Setup" → "To"
2. Agrega tu número personal
3. Recibirás código por WhatsApp para confirmar

## 🌐 Deployment en Railway

### 1. Preparar el proyecto

```bash
pnpm build
```

Esto genera la carpeta `dist/` con tu código compilado.

### 2. Crear proyecto en Railway

1. Ve a [Railway](https://railway.app/)
2. "New Project" → "Deploy from GitHub repo"
3. Conecta tu repositorio

### 3. Configurar variables de entorno

En Railway → Settings → Variables:

```
MONGODB_URI=mongodb+srv://...
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_ID=...
WHATSAPP_VERIFY_TOKEN=...
GEMINI_API_KEY=...
CLINIC_NAME=Mi Clínica
CLINIC_HOURS=Lunes a Viernes 9-6
```

### 4. Railway detectará automáticamente:

Railway usará pnpm automáticamente al detectar `pnpm-lock.yaml`.

Los scripts que ejecutará:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

Railway ejecutará `pnpm build` y luego `pnpm start`.

### 5. Obtener URL

Railway te dará una URL pública como:

```
https://tu-app.up.railway.app
```

## 🔗 Configurar Webhook en Meta

1. Ve a Meta Developer Console → Tu App → WhatsApp → Configuration
2. En "Webhook":
   - **Callback URL**: `https://tu-app.up.railway.app/webhook`
   - **Verify Token**: El mismo que pusiste en `WHATSAPP_VERIFY_TOKEN`
3. Click en "Verify and Save"
4. Suscribirse a: `messages`

## 📊 Endpoints Disponibles

### GET /health

Health check del servidor:

```bash
curl https://tu-app.up.railway.app/health
```

Respuesta:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "WhatsApp Clinic Bot"
}
```

### GET /dashboard

Estadísticas de conversaciones:

```bash
curl https://tu-app.up.railway.app/dashboard
```

Respuesta:

```json
{
  "clinic": "Clínica Demo",
  "stats": {
    "totalConversations": 15,
    "appointmentsScheduled": 8,
    "activeToday": 5
  },
  "recentConversations": [...]
}
```

### GET/POST /webhook

Usado por WhatsApp (no llamar manualmente)

## 🧪 Probar Localmente

### Opción 1: ngrok (para probar webhooks locales)

```bash
# Instalar ngrok
pnpm add -g ngrok

# O usar con npx (sin instalar globalmente)
pnpm dlx ngrok http 3000

# Exponer puerto 3000
ngrok http 3000
```

Usa la URL de ngrok en la configuración del webhook de Meta.

### Opción 2: Probar sin webhook

Puedes llamar directamente a la función de procesamiento:

```typescript
import { ConversationService } from './services/conversation.service';

const service = new ConversationService();
await service.processMessage('+5215551234567', 'Hola, quiero agendar una cita');
```

## 📁 Estructura del Proyecto

```
whatsapp-clinic-demo/
├── src/
│   ├── config/
│   │   └── index.ts           # Configuración centralizada
│   ├── controllers/
│   │   ├── webhook.controller.ts
│   │   └── health.controller.ts
│   ├── models/
│   │   └── Conversation.ts    # Schema de MongoDB
│   ├── services/
│   │   ├── database.service.ts
│   │   ├── gemini.service.ts
│   │   ├── whatsapp.service.ts
│   │   └── conversation.service.ts
│   ├── routes/
│   │   └── index.ts
│   ├── app.ts                 # Configuración de Express
│   └── index.ts               # Entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Flujo de Conversación

```
1. Usuario envía mensaje por WhatsApp
   ↓
2. Meta recibe mensaje → Webhook POST a tu backend
   ↓
3. Backend extrae número y mensaje
   ↓
4. Busca/crea conversación en MongoDB
   ↓
5. Envía mensaje + historial a Gemini
   ↓
6. Gemini genera respuesta contextual
   ↓
7. Backend guarda respuesta en MongoDB
   ↓
8. Envía respuesta por WhatsApp API
   ↓
9. Usuario recibe respuesta
```

## 🔐 Seguridad

- ✅ Helmet para headers de seguridad
- ✅ Variables de entorno para secretos
- ✅ Validación de verify token en webhook
- ✅ Manejo de errores global
- ✅ No expone datos sensibles en logs

## 📝 Personalización

### Cambiar el prompt de la IA

Edita `src/services/gemini.service.ts`:

```typescript
private buildSystemPrompt(): string {
  return `Eres un asistente de ${config.clinic.name}...
  
  // Personaliza aquí el comportamiento
  `;
}
```

### Agregar más servicios

Edita la sección "INFORMACIÓN DE LA CLÍNICA" en el prompt.

### Modificar lógica de agendamiento

Edita `src/services/conversation.service.ts` método `processMessage()`.

## 🐛 Troubleshooting

### "Error connecting to MongoDB"

- Verifica que tu IP esté permitida en MongoDB Atlas
- Usa "Allow from anywhere" (0.0.0.0/0) para pruebas

### "Webhook verification failed"

- Verifica que `WHATSAPP_VERIFY_TOKEN` sea el mismo en:
  - Tu archivo `.env`
  - La configuración del webhook en Meta

### "Message not sending"

- Verifica que el `WHATSAPP_TOKEN` sea válido
- Verifica que el número esté agregado en "números de prueba" en Meta

### "Gemini API error"

- Verifica que tu `GEMINI_API_KEY` sea válida
- Verifica que no hayas excedido rate limits

## 📞 Contacto

Desarrollado por: Jose Martin Perivan  
Email: martin_perivan@outlook.es

## 📄 Licencia

MIT
