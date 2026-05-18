import type { User } from "./types/entities";
import type { UpdateUserDto } from "./types/dto";
import { db } from "./seed";
import { logout } from "./auth";

export function getUsers(): User[] {
  return db.users;
}

export function getUserById(id: string): User | undefined {
  return db.users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function updateUser(id: string, updates: UpdateUserDto): User | null {
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...updates };
  return db.users[index];
}

export function deleteUser(id: string): boolean {
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  db.users.splice(index, 1);
  logout();
  return true;
}

export function searchUsers(query: string): User[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const currentId = localStorage.getItem("currentUserId");
  return db.users.filter(
    (u) =>
      u.id !== currentId &&
      (u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.id.toLowerCase() === q),
  );
}
