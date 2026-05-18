import type { Group, Message } from "./types/entities";
import type {
  CreateGroupDto,
  SendGroupMessageDto,
  LeaveGroupDto,
} from "./types/dto";
import { db, generateId } from "./seed";

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

export function createGroup({
  name,
  description,
  memberIds,
  createdBy,
}: CreateGroupDto): Group {
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

export function sendGroupMessage({
  groupId,
  senderId,
  content,
  type = "text",
  imageUrl,
}: SendGroupMessageDto): Message | null {
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

export function leaveGroup({ groupId, userId }: LeaveGroupDto): void {
  const group = db.groups.find((g) => g.id === groupId);
  if (group) {
    group.members = group.members.filter((id) => id !== userId);
  }
}
