# 💬 Ejemplos de Conversaciones

## Escenario 1: Agendamiento exitoso

```
👤 Usuario: Hola
🤖 Bot: ¡Hola! 😊 Bienvenido a Clínica Demo. ¿En qué puedo ayudarte hoy?

👤 Usuario: Quiero agendar una cita
🤖 Bot: ¡Perfecto! Con gusto te ayudo a agendar tu cita. 
       ¿Me podrías decir tu nombre completo?

👤 Usuario: Me llamo Juan Pérez
🤖 Bot: Mucho gusto, Juan. ¿Cuál es el motivo de tu consulta?

👤 Usuario: Me duele la garganta desde hace 3 días
🤖 Bot: Entiendo, Juan. Lamento que no te sientas bien. 
       ¿Qué día te gustaría venir a consulta?

👤 Usuario: El lunes 15 de enero
🤖 Bot: Perfecto. ¿A qué hora prefieres? 
       Nuestro horario es de 9:00 AM a 6:00 PM.

👤 Usuario: A las 10 de la mañana
🤖 Bot: ✅ ¡Cita agendada exitosamente!

       📋 Detalles:
       • Paciente: Juan Pérez
       • Motivo: Me duele la garganta desde hace 3 días
       • Fecha: El lunes 15 de enero
       • Hora: A las 10 de la mañana

       Un miembro de nuestro equipo confirmará tu cita pronto.
       ¡Nos vemos pronto! 😊
```

---

## Escenario 2: Consulta sobre horarios

```
👤 Usuario: Hola, ¿a qué hora abren?
🤖 Bot: ¡Hola! 😊 Nuestro horario de atención es:
       Lunes a Viernes de 9:00 AM a 6:00 PM
       
       ¿Necesitas agendar una cita?

👤 Usuario: ¿Atienden los sábados?
🤖 Bot: Por el momento solo atendemos de lunes a viernes.
       ¿Te gustaría agendar para algún día entre semana?

👤 Usuario: No, gracias
🤖 Bot: ¡De acuerdo! Si cambias de opinión, aquí estaré.
       ¡Que tengas un excelente día! 😊
```

---

## Escenario 3: Síntoma grave - Escalamiento

```
👤 Usuario: Me duele mucho el pecho y me falta el aire
🤖 Bot: ⚠️ Entiendo tu preocupación. El dolor de pecho y 
       dificultad para respirar pueden ser síntomas serios.
       
       Te recomiendo que acudas a URGENCIAS de inmediato
       o llames al 911.
       
       ¿Necesitas que te ayude con algo más mientras tanto?

👤 Usuario: Voy al hospital
🤖 Bot: Muy bien. Cuídate mucho y espero que te sientan bien pronto.
       Si después necesitas seguimiento, aquí estamos. 🙏
```

---

## Escenario 4: Solicitud de hablar con humano

```
👤 Usuario: Quiero hablar con un doctor
🤖 Bot: Entiendo que necesitas hablar con una persona. 👨‍⚕️

       Un miembro de nuestro equipo te contactará pronto
       por este mismo medio.
       
       Horario de atención: Lunes a Viernes 9:00 AM - 6:00 PM
       
       Gracias por tu paciencia. 🙏
```

---

## Escenario 5: Consulta sobre servicios

```
👤 Usuario: ¿Qué servicios ofrecen?
🤖 Bot: En Clínica Demo ofrecemos:
       
       ✅ Consulta general
       ✅ Pediatría
       ✅ Ginecología
       
       ¿Te interesa agendar una cita para alguno de estos servicios?

👤 Usuario: ¿Cuánto cuesta la consulta?
🤖 Bot: Para información sobre costos específicos,
       te recomiendo que te comuniques directamente con
       nuestra recepción o agendes una cita donde te
       podrán dar detalles precisos. 😊
       
       ¿Te gustaría agendar una cita ahora?
```

---

## Escenario 6: Usuario confundido

```
👤 Usuario: asldkjasd
🤖 Bot: Disculpa, no entendí tu mensaje. 😅
       
       ¿Necesitas ayuda con algo? Puedo ayudarte a:
       
       • Agendar una cita
       • Información sobre horarios
       • Información sobre servicios
       
       ¿En qué te puedo ayudar?

👤 Usuario: Quiero cita
🤖 Bot: ¡Perfecto! Con gusto te ayudo a agendar tu cita.
       ¿Me podrías decir tu nombre completo?
```

---

## Escenario 7: Cancelación / Reprogramación

```
👤 Usuario: Necesito cancelar mi cita
🤖 Bot: Entiendo que necesitas cancelar o reprogramar tu cita.
       
       Un miembro de nuestro equipo te contactará pronto
       para ayudarte con este proceso.
       
       ¿Hay algo más en lo que pueda ayudarte?

👤 Usuario: No, gracias
🤖 Bot: ¡Perfecto! Si necesitas algo más, aquí estaré. 😊
```

---

## 🎯 Casos que maneja el bot:

### ✅ Maneja bien:

- Saludos y conversación natural
- Agendamiento completo de citas
- Información sobre horarios y servicios
- Síntomas que requieren atención inmediata
- Solicitudes de escalamiento a humano
- Preguntas generales sobre la clínica

### ⚠️ Escala a humano cuando:

- Usuario pide hablar con doctor/médico
- Usuario está molesto o insatisfecho
- Preguntas sobre costos específicos
- Cambios o cancelaciones de citas existentes
- Consultas muy específicas sobre tratamientos

### 🚫 NO hace (por seguridad):

- Diagnosticar enfermedades
- Recetar medicamentos
- Dar consejos médicos específicos
- Acceder a historiales médicos
- Procesar pagos

---

## 💡 Tips para mejorar las conversaciones:

### 1. Personaliza el prompt

Edita `src/services/gemini.service.ts` → `buildSystemPrompt()`

### 2. Agrega más servicios

Modifica la lista de servicios en el prompt

### 3. Ajusta el tono

Cambia la "PERSONALIDAD" en el system prompt

### 4. Agrega más casos de escalamiento

Modifica `shouldEscalateToHuman()` con más keywords

---

¡Estas conversaciones muestran el poder de tu demo! 🚀
