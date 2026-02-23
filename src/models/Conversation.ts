import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  phoneNumber: string;
  patientName?: string;
  messages: IMessage[];
  appointmentScheduled: boolean;
  appointmentDetails?: {
    date?: string;
    time?: string;
    reason?: string;
  };
  lastInteraction: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSchema = new Schema<IConversation>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientName: {
      type: String,
    },
    messages: [MessageSchema],
    appointmentScheduled: {
      type: Boolean,
      default: false,
    },
    appointmentDetails: {
      date: String,
      time: String,
      reason: String,
    },
    lastInteraction: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas rápidas
ConversationSchema.index({ phoneNumber: 1, lastInteraction: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
