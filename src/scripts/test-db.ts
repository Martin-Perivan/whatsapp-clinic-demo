import { DatabaseService } from '../services/database.service';
import { Conversation } from '../models/Conversation';

async function testDatabase() {
  console.log('🧪 Testing MongoDB connection...\n');

  try {
    // Conectar
    const dbService = DatabaseService.getInstance();
    await dbService.connect();

    // Crear conversación de prueba
    console.log('Creating test conversation...');
    const testConversation = new Conversation({
      phoneNumber: '+5215551234567',
      patientName: 'Test Patient',
      messages: [
        {
          role: 'user',
          content: 'Hola, quiero agendar una cita',
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: '¡Hola! Con gusto te ayudo. ¿Cuál es tu nombre completo?',
          timestamp: new Date(),
        },
      ],
      appointmentScheduled: false,
    });

    await testConversation.save();
    console.log('✅ Test conversation created with ID:', testConversation._id);

    // Leer conversación
    const found = await Conversation.findById(testConversation._id);
    console.log('✅ Test conversation retrieved:', {
      phoneNumber: found?.phoneNumber,
      messageCount: found?.messages.length,
    });

    // Limpiar
    await Conversation.deleteOne({ _id: testConversation._id });
    console.log('✅ Test conversation deleted');

    console.log('\n🎉 All tests passed!');

    await dbService.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testDatabase();
