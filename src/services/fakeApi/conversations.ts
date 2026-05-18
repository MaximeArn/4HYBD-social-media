import type { Conversation, Message, User } from './types';
import { db, generateId } from './seed';

export function getConversations(
  userId: string,
): (Conversation & { otherUser: User; lastMessage?: Message })[] {
  return db.conversations
    .filter((c) => c.participants.includes(userId))
    .map((c) => {
      const otherId = c.participants.find((id) => id !== userId)!;
      const otherUser = db.users.find((u) => u.id === otherId)!;
      const lastMessage = c.messages[c.messages.length - 1];
      return { ...c, otherUser, lastMessage };
    })
    .sort((a, b) => {
      const aTime = a.lastMessage
        ? new Date(a.lastMessage.timestamp).getTime()
        : 0;
      const bTime = b.lastMessage
        ? new Date(b.lastMessage.timestamp).getTime()
        : 0;
      return bTime - aTime;
    });
}

export function getOrCreateConversation(
  userId1: string,
  userId2: string,
): Conversation {
  const existing = db.conversations.find(
    (c) => c.participants.includes(userId1) && c.participants.includes(userId2),
  );
  if (existing) return existing;

  const newConv: Conversation = {
    id: generateId(),
    participants: [userId1, userId2],
    messages: [],
  };
  db.conversations.push(newConv);
  return newConv;
}

export function getConversation(id: string): Conversation | undefined {
  return db.conversations.find((c) => c.id === id);
}

export function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  type: "text" | "image" = "text",
  imageUrl?: string,
): Message | null {
  const conv = db.conversations.find((c) => c.id === conversationId);
  if (!conv) return null;

  const message: Message = {
    id: generateId(),
    senderId,
    content,
    type,
    imageUrl,
    timestamp: new Date().toISOString(),
  };
  conv.messages.push(message);
  return message;
}
