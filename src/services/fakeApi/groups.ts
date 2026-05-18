import type { Group, Message } from './types';
import { db, generateId } from './seed';

export function getGroups(
  userId: string,
): (Group & { lastMessage?: Message })[] {
  return db.groups
    .filter((g) => g.members.includes(userId))
    .map((g) => {
      const lastMessage = g.messages[g.messages.length - 1];
      return { ...g, lastMessage };
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

export function getGroup(id: string): Group | undefined {
  return db.groups.find((g) => g.id === id);
}

export function createGroup(
  name: string,
  description: string,
  memberIds: string[],
  createdBy: string,
): Group {
  const members = memberIds.includes(createdBy)
    ? memberIds
    : [createdBy, ...memberIds];
  const newGroup: Group = {
    id: generateId(),
    name,
    description,
    members,
    createdBy,
    messages: [],
    createdAt: new Date().toISOString(),
  };
  db.groups.push(newGroup);
  return newGroup;
}

export function sendGroupMessage(
  groupId: string,
  senderId: string,
  content: string,
  type: "text" | "image" = "text",
  imageUrl?: string,
): Message | null {
  const group = db.groups.find((g) => g.id === groupId);
  if (!group) return null;

  const message: Message = {
    id: generateId(),
    senderId,
    content,
    type,
    imageUrl,
    timestamp: new Date().toISOString(),
  };
  group.messages.push(message);
  return message;
}

export function leaveGroup(groupId: string, userId: string): void {
  const group = db.groups.find((g) => g.id === groupId);
  if (group) {
    group.members = group.members.filter((id) => id !== userId);
  }
}
