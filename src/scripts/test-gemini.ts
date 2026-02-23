import { GeminiService } from '../services/gemini.service';

async function testGemini() {
  console.log('🧪 Testing Gemini AI integration...\n');

  try {
    const geminiService = new GeminiService();

    // Test 1: Primera interacción
    console.log('Test 1: Initial greeting');
    const response1 = await geminiService.generateResponse('Hola, buenas tardes', []);
    console.log('User: Hola, buenas tardes');
    console.log('AI:', response1);
    console.log('✅ Test 1 passed\n');

    // Test 2: Con historial
    console.log('Test 2: With conversation history');
    const response2 = await geminiService.generateResponse('Quiero agendar una cita', [
      {
        role: 'user',
        content: 'Hola, buenas tardes',
        timestamp: new Date(),
      },
      {
        role: 'assistant',
        content: response1,
        timestamp: new Date(),
      },
    ]);
    console.log('User: Quiero agendar una cita');
    console.log('AI:', response2);
    console.log('✅ Test 2 passed\n');

    // Test 3: Escalamiento
    console.log('Test 3: Escalation detection');
    const shouldEscalate = geminiService.shouldEscalateToHuman('Quiero hablar con un doctor');
    console.log('Message: "Quiero hablar con un doctor"');
    console.log('Should escalate:', shouldEscalate);
    console.log(shouldEscalate ? '✅ Test 3 passed' : '❌ Test 3 failed');
    console.log('');

    // Test 4: Extracción de información
    console.log('Test 4: Appointment info extraction');
    const messages = [
      { role: 'user' as const, content: 'Mi nombre es Juan Pérez', timestamp: new Date() },
      {
        role: 'assistant' as const,
        content: '¿Cuál es el motivo de tu consulta?',
        timestamp: new Date(),
      },
      { role: 'user' as const, content: 'Me duele la garganta', timestamp: new Date() },
      {
        role: 'assistant' as const,
        content: '¿Qué día prefieres?',
        timestamp: new Date(),
      },
      { role: 'user' as const, content: 'El lunes 15 de enero', timestamp: new Date() },
      {
        role: 'assistant' as const,
        content: '¿A qué hora?',
        timestamp: new Date(),
      },
      { role: 'user' as const, content: 'A las 10:00 AM', timestamp: new Date() },
    ];

    const appointmentInfo = geminiService.extractAppointmentInfo(messages);
    console.log('Appointment info detected:', appointmentInfo);
    console.log(
      appointmentInfo.hasName &&
        appointmentInfo.hasReason &&
        appointmentInfo.hasDate &&
        appointmentInfo.hasTime
        ? '✅ Test 4 passed'
        : '❌ Test 4 failed'
    );

    console.log('\n🎉 All Gemini tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testGemini();
