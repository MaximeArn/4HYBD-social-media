import type { Story, User } from "./types/entities";
import type { GetStoriesNearbyDto, CreateStoryDto } from "./types/dto";
import { db, generateId } from "./seed";

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
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

export function getStoriesNearby({
  lat,
  lng,
  radiusKm = 1000,
}: GetStoriesNearbyDto): (Story & { user: User; distance: number })[] {
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

export function getStoriesByUser(userId: string): Story[] {
  return db.stories
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createStory({
  userId,
  caption,
  imageUrl,
}: CreateStoryDto): Story {
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
