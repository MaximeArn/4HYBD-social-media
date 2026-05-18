import type { User } from './types';
import { db, generateId } from './seed';

export function login(email: string, password: string): User | null {
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (user) {
    localStorage.setItem("currentUserId", user.id);
  }
  return user || null;
}

export function logout(): void {
  localStorage.removeItem("currentUserId");
}

export function getCurrentUser(): User | null {
  const id = localStorage.getItem("currentUserId");
  if (!id) return null;
  return db.users.find((u) => u.id === id) || null;
}

export function register(data: {
  email: string;
  password: string;
  username: string;
  bio?: string;
  city?: string;
}): { user: User | null; error: string | null } {
  const existing = db.users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase(),
  );
  if (existing) {
    return { user: null, error: "Cet email est déjà utilisé." };
  }

  const avatarNum = Math.floor(Math.random() * 70) + 1;
  const newUser: User = {
    id: generateId(),
    email: data.email,
    password: data.password,
    username: data.username,
    bio: data.bio || "",
    avatar: `https://i.pravatar.cc/150?img=${avatarNum}`,
    location: { lat: 48.8566, lng: 2.3522, city: data.city || "Paris" },
    friends: [],
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  localStorage.setItem("currentUserId", newUser.id);
  return { user: newUser, error: null };
}
