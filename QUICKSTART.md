# ⚡ INICIO RÁPIDO - 5 MINUTOS

## 🎯 Para empezar AHORA

### 1. Instalar dependencias (2 min)

```bash
cd whatsapp-clinic-demo
pnpm install
```

### 2. Configurar .env (2 min)

```bash
cp .env.example .env
```

Edita `.env` y agrega TUS credenciales:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://...  # Tu URI de MongoDB Atlas

# WhatsApp
WHATSAPP_TOKEN=...              # De Meta Developer Console
WHATSAPP_PHONE_ID=...           # De Meta Developer Console
WHATSAPP_VERIFY_TOKEN=mi_secreto_123  # Inventa uno

# Gemini
GEMINI_API_KEY=...              # De Google AI Studio

# Clínica
CLINIC_NAME=Mi Clínica Demo
CLINIC_HOURS=Lunes a Viernes 9-6
```

### 3. Probar localmente (1 min)

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

---

## 🧪 Tests opcionales

### Test MongoDB:

```bash
pnpm dlx tsx src/scripts/test-db.ts
```

### Test Gemini:

```bash
pnpm dlx tsx src/scripts/test-gemini.ts
```

---

## 🚀 Deploy (después de probar local)

Lee `DEPLOYMENT.md` para instrucciones completas.

Resumen:

1. Sube a GitHub
2. Conecta con Railway
3. Agrega variables de entorno
4. Configura webhook en Meta
5. ¡Listo!

---

## 📱 Probar con WhatsApp

1. Agrega tu número en Meta Developer Console
2. Envía mensaje al número de prueba
3. ¡El bot responderá!

---

## 📚 Más info

- `README.md` - Documentación completa
- `DEPLOYMENT.md` - Guía de deployment paso a paso

---

## ❓ ¿Necesitas las credenciales?

### MongoDB Atlas:

1. https://www.mongodb.com/cloud/atlas/register
2. Crear cluster FREE
3. Copiar connection string

### Gemini API:

1. https://aistudio.google.com
2. "Get API Key"
3. Copiar key

### WhatsApp (ya lo tienes):

1. https://developers.facebook.com/
2. Tu app → WhatsApp → Configuration
3. Copiar Token y Phone ID

---

¡Listo para desarrollar! 🎉
