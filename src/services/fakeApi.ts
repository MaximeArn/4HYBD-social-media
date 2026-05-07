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

// ---- Utilitaires pour les dates ----

function hoursAgo(h: number): string {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
}

function daysAgo(days: number, hour = 12): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function hoursFromNow(h: number): string {
  const d = new Date();
  d.setHours(d.getHours() + h);
  return d.toISOString();
}

// ---- Générateur d'ID unique ----

let nextId = 200;
function generateId(): string {
  return `id_${++nextId}_${Date.now()}`;
}

// ============================================================
// La "fausse base de données" — pré-remplie au lancement
// ============================================================

const db: {
  users: User[];
  conversations: Conversation[];
  groups: Group[];
  stories: Story[];
} = {
  users: [
    {
      id: "u1",
      email: "marie@snapshoot.com",
      password: "password123",
      username: "Marie Dupont",
      bio: "📸 Passionnée de photo | Parisienne ❤️",
      avatar: "https://i.pravatar.cc/150?img=1",
      location: { lat: 48.8566, lng: 2.3522, city: "Paris" },
      friends: ["u2", "u3"],
      createdAt: daysAgo(30),
    },
    {
      id: "u2",
      email: "thomas@snapshoot.com",
      password: "password123",
      username: "Thomas Martin",
      bio: "🎸 Musicien | Lyon forever 🦁",
      avatar: "https://i.pravatar.cc/150?img=3",
      location: { lat: 45.764, lng: 4.8357, city: "Lyon" },
      friends: ["u1", "u3", "u4"],
      createdAt: daysAgo(25),
    },
    {
      id: "u3",
      email: "sophie@snapshoot.com",
      password: "password123",
      username: "Sophie Bernard",
      bio: "🌊 La mer c'est la vie | Marseille 🔵⚪",
      avatar: "https://i.pravatar.cc/150?img=5",
      location: { lat: 43.2965, lng: 5.3698, city: "Marseille" },
      friends: ["u1", "u2"],
      createdAt: daysAgo(20),
    },
    {
      id: "u4",
      email: "lucas@snapshoot.com",
      password: "password123",
      username: "Lucas Petit",
      bio: "🍷 Amateur de bons vins | Bordeaux 🏰",
      avatar: "https://i.pravatar.cc/150?img=7",
      location: { lat: 44.8378, lng: -0.5792, city: "Bordeaux" },
      friends: ["u2"],
      createdAt: daysAgo(15),
    },
    {
      id: "u5",
      email: "emma@snapshoot.com",
      password: "password123",
      username: "Emma Rousseau",
      bio: "🌸 Artiste | Toulouse la rose 🌹",
      avatar: "https://i.pravatar.cc/150?img=9",
      location: { lat: 43.6047, lng: 1.4442, city: "Toulouse" },
      friends: [],
      createdAt: daysAgo(10),
    },
    {
      id: "u6",
      email: "hugo@snapshoot.com",
      password: "password123",
      username: "Hugo Moreau",
      bio: "⚽ Fan de foot | Ch'ti fier 🍺",
      avatar: "https://i.pravatar.cc/150?img=12",
      location: { lat: 50.6292, lng: 3.0573, city: "Lille" },
      friends: [],
      createdAt: daysAgo(8),
    },
    {
      id: "u7",
      email: "camille@snapshoot.com",
      password: "password123",
      username: "Camille Simon",
      bio: "🌿 Nature & Voyage | Nantes 🐘",
      avatar: "https://i.pravatar.cc/150?img=20",
      location: { lat: 47.2184, lng: -1.5536, city: "Nantes" },
      friends: [],
      createdAt: daysAgo(5),
    },
    {
      id: "u8",
      email: "antoine@snapshoot.com",
      password: "password123",
      username: "Antoine Lefebvre",
      bio: "🏰 Histoire & Culture | Strasbourg 🥨",
      avatar: "https://i.pravatar.cc/150?img=33",
      location: { lat: 48.5734, lng: 7.7521, city: "Strasbourg" },
      friends: [],
      createdAt: daysAgo(3),
    },
  ],

  conversations: [
    {
      id: "c1",
      participants: ["u1", "u2"],
      messages: [
        {
          id: "m1",
          senderId: "u2",
          content: "Salut Marie ! Comment tu vas ? 😊",
          type: "text",
          timestamp: daysAgo(1, 10),
        },
        {
          id: "m2",
          senderId: "u1",
          content: "Super bien merci ! Et toi Thomas ?",
          type: "text",
          timestamp: daysAgo(1, 11),
        },
        {
          id: "m3",
          senderId: "u2",
          content: "Nickel ! Tu fais quoi ce weekend ? 🎉",
          type: "text",
          timestamp: daysAgo(1, 14),
        },
        {
          id: "m4",
          senderId: "u1",
          content: "Je sais pas encore, peut-être sortir à Paris 😄",
          type: "text",
          timestamp: hoursAgo(3),
        },
      ],
    },
    {
      id: "c2",
      participants: ["u1", "u3"],
      messages: [
        {
          id: "m5",
          senderId: "u3",
          content: "Hey ! J'ai vu ta story de la Tour Eiffel 😍",
          type: "text",
          timestamp: hoursAgo(5),
        },
        {
          id: "m6",
          senderId: "u1",
          content: "Oui c'était trop beau ce soir ✨",
          type: "text",
          timestamp: hoursAgo(4),
        },
        {
          id: "m7",
          senderId: "u3",
          content: "J'adorerais venir à Paris bientôt !",
          type: "text",
          timestamp: hoursAgo(2),
        },
      ],
    },
  ],

  groups: [
    {
      id: "g1",
      name: "Les Potes 🎉",
      description: "Notre groupe de potes adorés !",
      members: ["u1", "u2", "u3", "u4"],
      createdBy: "u1",
      messages: [
        {
          id: "gm1",
          senderId: "u2",
          content: "Coucou tout le monde ! 👋",
          type: "text",
          timestamp: daysAgo(1, 9),
        },
        {
          id: "gm2",
          senderId: "u3",
          content: "Salut les amis ! 🌊",
          type: "text",
          timestamp: daysAgo(1, 10),
        },
        {
          id: "gm3",
          senderId: "u4",
          content: "Yo yo ! Bordeaux represent 🍷",
          type: "text",
          timestamp: daysAgo(1, 11),
        },
        {
          id: "gm4",
          senderId: "u1",
          content: "On se fait un trip ce weekend ? 🗺️",
          type: "text",
          timestamp: hoursAgo(6),
        },
        {
          id: "gm5",
          senderId: "u2",
          content: "Bonne idée ! Lyon ou Paris ?",
          type: "text",
          timestamp: hoursAgo(5),
        },
        {
          id: "gm6",
          senderId: "u3",
          content: "Paris c'est loin de Marseille 😅 mais je suis partant !",
          type: "text",
          timestamp: hoursAgo(4),
        },
      ],
      createdAt: daysAgo(7),
    },
    {
      id: "g2",
      name: "Projet Supinfo 📚",
      description: "Groupe pour organiser notre projet scolaire",
      members: ["u1", "u2", "u6"],
      createdBy: "u1",
      messages: [
        {
          id: "gm7",
          senderId: "u1",
          content: "Bonjour à tous ! Voici notre groupe de projet 🚀",
          type: "text",
          timestamp: daysAgo(2, 9),
        },
        {
          id: "gm8",
          senderId: "u2",
          content: "Parfait, on peut commencer à s'organiser !",
          type: "text",
          timestamp: daysAgo(2, 10),
        },
        {
          id: "gm9",
          senderId: "u6",
          content: "Top ! Je m'occupe de la documentation 📝",
          type: "text",
          timestamp: daysAgo(1, 14),
        },
      ],
      createdAt: daysAgo(14),
    },
  ],

  stories: [
    {
      id: "s1",
      userId: "u2",
      imageUrl: "https://picsum.photos/seed/lyon1/400/700",
      caption: "Belle journée à Lyon ! ☀️ La Fourvière sous le soleil",
      location: { lat: 45.764, lng: 4.8357, city: "Lyon" },
      createdAt: hoursAgo(8),
      expiresAt: hoursFromNow(16),
    },
    {
      id: "s2",
      userId: "u3",
      imageUrl: "https://picsum.photos/seed/marseille1/400/700",
      caption: "La mer est magnifique aujourd'hui 🌊 #Calanques",
      location: { lat: 43.2965, lng: 5.3698, city: "Marseille" },
      createdAt: hoursAgo(12),
      expiresAt: hoursFromNow(12),
    },
    {
      id: "s3",
      userId: "u4",
      imageUrl: "https://picsum.photos/seed/bordeaux1/400/700",
      caption: "Dégustation au château ce matin 🍷 #Gironde",
      location: { lat: 44.8378, lng: -0.5792, city: "Bordeaux" },
      createdAt: hoursAgo(6),
      expiresAt: hoursFromNow(18),
    },
    {
      id: "s4",
      userId: "u5",
      imageUrl: "https://picsum.photos/seed/toulouse1/400/700",
      caption: "La ville rose sous le ciel bleu 💙 #Toulouse",
      location: { lat: 43.6047, lng: 1.4442, city: "Toulouse" },
      createdAt: hoursAgo(4),
      expiresAt: hoursFromNow(20),
    },
    {
      id: "s5",
      userId: "u1",
      imageUrl: "https://picsum.photos/seed/paris1/400/700",
      caption: "Tour Eiffel au coucher du soleil 🗼✨ #Paris",
      location: { lat: 48.8566, lng: 2.3522, city: "Paris" },
      createdAt: hoursAgo(2),
      expiresAt: hoursFromNow(22),
    },
    {
      id: "s6",
      userId: "u6",
      imageUrl: "https://picsum.photos/seed/lille1/400/700",
      caption: "Grand Place de Lille en soirée 🏛️ #Lille",
      location: { lat: 50.6292, lng: 3.0573, city: "Lille" },
      createdAt: hoursAgo(10),
      expiresAt: hoursFromNow(14),
    },
    {
      id: "s7",
      userId: "u7",
      imageUrl: "https://picsum.photos/seed/nantes1/400/700",
      caption: "Les Machines de l'île, c'est incroyable 🐘 #Nantes",
      location: { lat: 47.2184, lng: -1.5536, city: "Nantes" },
      createdAt: hoursAgo(5),
      expiresAt: hoursFromNow(19),
    },
    {
      id: "s8",
      userId: "u8",
      imageUrl: "https://picsum.photos/seed/stras1/400/700",
      caption: "Vieille ville magnifique au crépuscule 🏰 #Strasbourg",
      location: { lat: 48.5734, lng: 7.7521, city: "Strasbourg" },
      createdAt: hoursAgo(7),
      expiresAt: hoursFromNow(17),
    },
    {
      id: "s9",
      userId: "u2",
      imageUrl: "https://picsum.photos/seed/lyon2/400/700",
      caption: "Bouchon lyonnais ce soir, c'est trop bon ! 🍽️",
      location: { lat: 45.764, lng: 4.8357, city: "Lyon" },
      createdAt: hoursAgo(3),
      expiresAt: hoursFromNow(21),
    },
    {
      id: "s10",
      userId: "u3",
      imageUrl: "https://picsum.photos/seed/marseille2/400/700",
      caption: "Sunset sur le Vieux-Port 🌅 #Marseille #Beautiful",
      location: { lat: 43.2965, lng: 5.3698, city: "Marseille" },
      createdAt: hoursAgo(1),
      expiresAt: hoursFromNow(23),
    },
  ],
};

// ---- Calcul de distance GPS (formule Haversine) ----

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ============================================================
// AUTH
// ============================================================

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

// ============================================================
// UTILISATEURS (CRUD)
// ============================================================

export function getUsers(): User[] {
  return db.users;
}

export function getUserById(id: string): User | undefined {
  return db.users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "password">>,
): User | null {
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

// ============================================================
// AMIS
// ============================================================

export function addFriend(userId: string, friendId: string): void {
  const user = db.users.find((u) => u.id === userId);
  const friend = db.users.find((u) => u.id === friendId);
  if (!user || !friend) return;
  if (!user.friends.includes(friendId)) user.friends.push(friendId);
  if (!friend.friends.includes(userId)) friend.friends.push(userId);
}

export function removeFriend(userId: string, friendId: string): void {
  const user = db.users.find((u) => u.id === userId);
  const friend = db.users.find((u) => u.id === friendId);
  if (user) user.friends = user.friends.filter((id) => id !== friendId);
  if (friend) friend.friends = friend.friends.filter((id) => id !== userId);
}

// ============================================================
// CONVERSATIONS (messages directs 1-à-1)
// ============================================================

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

// ============================================================
// GROUPES (messages de groupe)
// ============================================================

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

// ============================================================
// STORIES (géolocalisées)
// ============================================================

export function getStoriesNearby(
  lat: number,
  lng: number,
  radiusKm: number = 1000,
): (Story & { user: User; distance: number })[] {
  const now = new Date();
  return db.stories
    .filter((s) => new Date(s.expiresAt) > now)
    .map((s) => {
      const user = db.users.find((u) => u.id === s.userId)!;
      const distance = getDistance(lat, lng, s.location.lat, s.location.lng);
      return { ...s, user, distance };
    })
    .filter((s) => s.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

export function createStory(
  userId: string,
  caption: string,
  imageUrl: string,
): Story {
  const user = db.users.find((u) => u.id === userId)!;
  const newStory: Story = {
    id: generateId(),
    userId,
    imageUrl,
    caption,
    location: user.location,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  db.stories.push(newStory);
  return newStory;
}

// ============================================================
// UTILITAIRES D'AFFICHAGE
// ============================================================

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  return `Il y a ${diffDays} jours`;
}

export function formatDistance(km: number): string {
  if (km < 1) return "Moins d'1 km";
  if (km < 100) return `${Math.round(km)} km`;
  return `${Math.round(km)} km`;
}
