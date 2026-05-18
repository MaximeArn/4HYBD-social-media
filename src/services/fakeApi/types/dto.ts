import type { User } from "./entities";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
  bio?: string;
  city?: string;
}

export type UpdateUserDto = Partial<Omit<User, "id" | "password">>;

export interface AddFriendDto {
  userId: string;
  friendId: string;
}

export interface RemoveFriendDto {
  userId: string;
  friendId: string;
}

export interface GetOrCreateConversationDto {
  userId1: string;
  userId2: string;
}

export interface SendMessageDto {
  conversationId: string;
  senderId: string;
  content: string;
  type?: "text" | "image";
  imageUrl?: string;
}

export interface CreateGroupDto {
  name: string;
  description: string;
  memberIds: string[];
  createdBy: string;
}

export interface SendGroupMessageDto {
  groupId: string;
  senderId: string;
  content: string;
  type?: "text" | "image";
  imageUrl?: string;
}

export interface LeaveGroupDto {
  groupId: string;
  userId: string;
}

export interface EditGroupDto {
  groupId: string;
  name: string;
  description: string;
  memberIds: string[];
}

export interface GetStoriesNearbyDto {
  lat: number;
  lng: number;
  radiusKm?: number;
}

export interface CreateStoryDto {
  userId: string;
  caption: string;
  imageUrl: string;
}
