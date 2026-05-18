export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  bio: string;
  avatar: string;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  friends: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: "text" | "image";
  imageUrl?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdBy: string;
  messages: Message[];
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  createdAt: string;
  expiresAt: string;
}
