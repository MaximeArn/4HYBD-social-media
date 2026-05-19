import type { User, Conversation, Group, Story } from "../types/entities";
import { users } from "./users";
import { stories } from "./stories";
import { conversations } from "./conversations";
import { groups } from "./groups";

let nextId = 200;
export function generateId(): string {
  return `id_${++nextId}_${Date.now()}`;
}

export const db: {
  users: User[];
  conversations: Conversation[];
  groups: Group[];
  stories: Story[];
} = {
  users,
  conversations,
  groups,
  stories,
};
