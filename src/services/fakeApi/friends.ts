import { db } from './seed';

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
