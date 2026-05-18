import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  searchUsers,
  addFriend,
  removeFriend,
  getUserById,
  getOrCreateConversation,
  type User,
} from '../services/fakeApi';
import UserListItem from '../components/UserListItem';

const Friends: React.FC = () => {
  const [segment, setSegment] = useState<'mes-amis' | 'recherche'>('mes-amis');
  const [friends, setFriends] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadFriends(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  function loadFriends() {
    if (!currentUser) return;
    const freshUser = getUserById(currentUser.id);
    if (!freshUser) return;
    const friendList = freshUser.friends
      .map((id) => getUserById(id))
      .filter((u): u is User => !!u);
    setFriends(friendList);
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchUsers(query));
    } else {
      setSearchResults([]);
    }
  }

  function handleAddFriend(user: User) {
    if (!currentUser) return;
    addFriend({ userId: currentUser.id, friendId: user.id });
    loadFriends();
    setToastMsg(`${user.username} ajouté(e) à tes amis !`);
  }

  function handleRemoveFriend(user: User) {
    if (!currentUser) return;
    removeFriend({ userId: currentUser.id, friendId: user.id });
    loadFriends();
    setToastMsg(`${user.username} retiré(e) de tes amis.`);
  }

  function handleMessage(user: User) {
    if (!currentUser) return;
    const conv = getOrCreateConversation({ userId1: currentUser.id, userId2: user.id });
    history.push(`/tabs/chat/${conv.id}`);
  }

  function isFriendOf(userId: string): boolean {
    return friends.some((f) => f.id === userId);
  }

  if (!currentUser) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Amis</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as 'mes-amis' | 'recherche')}>
            <IonSegmentButton value="mes-amis">
              <IonLabel>Mes amis ({friends.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="recherche">
              <IonLabel>Rechercher</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {segment === 'mes-amis' && (
          <>
            {friends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'gray' }}>
                <p>Tu n'as pas encore d'amis.</p>
                <p>Va dans "Rechercher" pour en trouver !</p>
              </div>
            ) : (
              <IonList>
                {friends.map((friend) => (
                  <UserListItem
                    key={friend.id}
                    user={friend}
                    onViewProfile={(id) => history.push(`/tabs/user/${id}`)}
                    onMessage={() => handleMessage(friend)}
                    onRemoveFriend={() => handleRemoveFriend(friend)}
                    iconActions
                  />
                ))}
              </IonList>
            )}
          </>
        )}

        {segment === 'recherche' && (
          <>
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => handleSearch(e.detail.value!)}
              placeholder="Nom, email ou ID..."
              debounce={300}
            />
            <IonNote style={{ display: 'block', padding: '4px 16px', fontSize: '0.8rem' }}>
              Tu peux chercher par nom, email ou ID utilisateur
            </IonNote>

            {searchQuery.length > 0 && searchResults.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'gray' }}>
                <p>Aucun résultat pour "{searchQuery}"</p>
              </div>
            )}

            <IonList>
              {searchResults.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  onViewProfile={(id) => history.push(`/tabs/user/${id}`)}
                  showEmail
                  isFriend={isFriendOf(user.id)}
                  onAddFriend={() => handleAddFriend(user)}
                  onRemoveFriend={() => handleRemoveFriend(user)}
                />
              ))}
            </IonList>
          </>
        )}

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2000}
          onDidDismiss={() => setToastMsg('')}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Friends;
