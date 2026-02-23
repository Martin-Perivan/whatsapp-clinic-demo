# 🚀 Guía de Deployment - 15 minutos

## ✅ Checklist Pre-Deployment

- [ ] MongoDB Atlas configurado
- [ ] API Key de Gemini obtenida
- [ ] App de Meta creada
- [ ] Credenciales de WhatsApp obtenidas
- [ ] Código testeado localmente

---

## PASO 1: MongoDB Atlas (5 min)

### 1.1 Crear cuenta

Ve a https://www.mongodb.com/cloud/atlas/register

### 1.2 Crear cluster FREE

1. "Build a Database" → FREE (M0)
2. Provider: AWS
3. Region: más cercana a México (us-east-1)
4. Cluster Name: "clinic-demo"
5. "Create"

### 1.3 Configurar acceso

**Database Access:**

1. "Database Access" → "Add New Database User"
2. Username: `admin`
3. Password: (genera una segura)
4. Role: "Atlas admin"
5. "Add User"

**Network Access:**

1. "Network Access" → "Add IP Address"
2. "Allow Access from Anywhere" (0.0.0.0/0)
3. "Confirm"

### 1.4 Obtener connection string

1. "Database" → "Connect"
2. "Drivers" → Node.js
3. Copiar URI:

```
mongodb+srv://admin:<password>@clinic-demo.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

4. Reemplazar `<password>` con tu password
5. Agregar nombre de DB al final:

```
mongodb+srv://admin:tupassword@clinic-demo.xxxxx.mongodb.net/whatsapp-clinic?retryWrites=true&w=majority
```

✅ **Guarda este URI**

---

## PASO 2: Google Gemini API (2 min)

### 2.1 Obtener API Key

1. Ve a https://aistudio.google.com
2. "Get API Key"
3. "Create API key in new project"
4. Copiar la key:

```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

✅ **Guarda esta key**

---

## PASO 3: WhatsApp Cloud API (Ya lo tienes configurado)

Ya hiciste esto anteriormente, solo necesitas obtener:

1. **WHATSAPP_TOKEN**: Access Token
2. **WHATSAPP_PHONE_ID**: Phone Number ID
3. **WHATSAPP_VERIFY_TOKEN**: Crea uno (ej: `mi_secreto_clinic_2024`)

✅ **Guarda estas 3 credenciales**

---

## PASO 4: Railway Deployment (5 min)

### 4.1 Crear cuenta en Railway

Ve a https://railway.app → Sign up con GitHub

### 4.2 Subir código a GitHub

```bash
# Asegurarte de tener pnpm-lock.yaml
pnpm install

# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit - WhatsApp Clinic Bot"

# Crear repo en GitHub
# Ve a github.com → New repository → "whatsapp-clinic-demo"

# Conectar y push
git remote add origin https://github.com/tu-usuario/whatsapp-clinic-demo.git
git branch -M main
git push -u origin main
```

### 4.3 Deploy en Railway

1. Railway → "New Project"
2. "Deploy from GitHub repo"
3. Selecciona `whatsapp-clinic-demo`
4. Railway detectará automáticamente Node.js y **pnpm** (gracias a `pnpm-lock.yaml`)

### 4.4 Agregar variables de entorno

Railway → Settings → Variables → Add variables:

```
MONGODB_URI=mongodb+srv://admin:tupassword@...
WHATSAPP_TOKEN=tu_token_de_meta
WHATSAPP_PHONE_ID=tu_phone_id
WHATSAPP_VERIFY_TOKEN=mi_secreto_clinic_2024
GEMINI_API_KEY=AIzaSy...
CLINIC_NAME=Clínica Demo
CLINIC_HOURS=Lunes a Viernes 9:00 AM - 6:00 PM
NODE_ENV=production
```

### 4.5 Redeploy

Railway → Deployments → "Redeploy"

### 4.6 Obtener URL

Railway → Settings → Domains → "Generate Domain"

Tu URL será algo como:

```
https://whatsapp-clinic-demo-production.up.railway.app
```

✅ **Guarda esta URL**

---

## PASO 5: Configurar Webhook en Meta (3 min)

### 5.1 Ir a Meta Developer Console

https://developers.facebook.com/ → Tu App → WhatsApp → Configuration

### 5.2 Configurar Webhook

**Callback URL:**

```
https://whatsapp-clinic-demo-production.up.railway.app/webhook
```

**Verify Token:**

```
mi_secreto_clinic_2024
```

(El mismo que pusiste en `WHATSAPP_VERIFY_TOKEN`)

### 5.3 Verificar

Click en "Verify and Save"

Si todo está bien, verás: ✅ "Verified"

### 5.4 Suscribirse a mensajes

En "Webhook fields" → Selecciona:

- ☑️ messages

Click "Subscribe"

---

## PASO 6: Probar (2 min)

### 6.1 Enviar mensaje de prueba

1. Abre WhatsApp en tu teléfono
2. Envía mensaje al número de prueba de Meta
3. Espera respuesta de la IA

### Ejemplos de mensajes:

```
"Hola"
"Quiero agendar una cita"
"Me duele la garganta"
```

### 6.2 Verificar logs

Railway → Deployments → View Logs

Deberías ver:

```
📨 New message from 5215551234567: "Hola"
✅ Message sent to 5215551234567
```

---

## ✅ Deployment Exitoso

Si recibes respuestas en WhatsApp, **¡FUNCIONA!**

---

## 📊 URLs Útiles

**Health Check:**

```
https://tu-app.up.railway.app/health
```

**Dashboard:**

```
https://tu-app.up.railway.app/dashboard
```

**Logs en Railway:**

Railway → Deployments → View Logs

**MongoDB Atlas:**

https://cloud.mongodb.com/ → Database → Browse Collections

---

## 🐛 Si algo falla

### Error: "Webhook verification failed"

- Verifica que `WHATSAPP_VERIFY_TOKEN` sea el mismo en Railway y Meta

### Error: "Message not sending"

- Verifica que tu número esté agregado en "números de prueba" en Meta
- Verifica que `WHATSAPP_TOKEN` sea válido

### Error: "MongoDB connection failed"

- Verifica que la IP esté permitida (0.0.0.0/0)
- Verifica que el password en el URI sea correcto

### Error: "Gemini API error"

- Verifica que tu API key sea válida
- Intenta regenerar la key en Google AI Studio

---

## 🎉 Siguiente Paso

**Graba tu video demo:**

1. Abre WhatsApp
2. Graba pantalla mientras chateas con el bot
3. Muestra cómo agenda cita
4. Muestra el dashboard en el navegador
5. ¡Listo para mostrar a clientes!

---

¿Problemas? Revisa los logs en Railway o contacta.
