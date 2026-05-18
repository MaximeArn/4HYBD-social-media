import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonSearchbar,
  IonButton,
  IonButtons,
  useIonViewWillEnter,
} from '@ionic/react';
import AppHeader from '../components/AppHeader';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getConversations,
  getGroups,
  getOrCreateConversation,
  getUserById,
  type User,
} from '../services/fakeApi';
import ConversationItem from '../components/ConversationItem';
import GroupItem from '../components/GroupItem';
import './Messages.css';

const Messages: React.FC = () => {
  const [segment, setSegment] = useState<'direct' | 'groupes'>('direct');
  const [conversations, setConversations] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const history = useHistory();
  const currentUser = getCurrentUser();

  useEffect(() => {
    refreshData();
  }, []);

  useIonViewWillEnter(() => {
    refreshData();
  });

  useEffect(() => {
    if (showNewChat) {
      setSearchResults(getFriends());
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [showNewChat]);

  function getFriends(): User[] {
    if (!currentUser) return [];
    return currentUser.friends
      .map((id) => getUserById(id))
      .filter((u): u is User => !!u);
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    const friends = getFriends();
    if (query.trim()) {
      const q = query.toLowerCase();
      setSearchResults(friends.filter((u) =>
        u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      ));
    } else {
      setSearchResults(friends);
    }
  }

  function openChatWith(user: User) {
    if (!currentUser) return;
    const conv = getOrCreateConversation({ userId1: currentUser.id, userId2: user.id });
    setShowNewChat(false);
    history.push(`/tabs/chat/${conv.id}`);
  }

  function refreshData() {
    if (!currentUser) return;
    setConversations(getConversations(currentUser.id));
    setGroups(getGroups(currentUser.id));
  }

  if (!currentUser) return null;

  return (
    <IonPage>
      <AppHeader />
      <IonHeader>
        <IonToolbar>
          <IonSegment value={segment} onIonChange={(e) => { setSegment(e.detail.value as any); refreshData(); }}>
            <IonSegmentButton value="direct">
              <IonLabel>Directs</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="groupes">
              <IonLabel>Groupes</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {segment === 'direct' && (
          <>
            {conversations.length === 0 ? (
              <div className="messages-empty">
                <p>Aucune conversation</p>
                <p>Appuie sur + pour écrire à quelqu'un</p>
              </div>
            ) : (
              <IonList>
                {conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    onClick={() => history.push(`/tabs/chat/${conv.id}`)}
                  />
                ))}
              </IonList>
            )}
          </>
        )}

        {segment === 'groupes' && (
          <>
            {groups.length === 0 ? (
              <div className="messages-empty">
                <p>Aucun groupe</p>
                <p>Appuie sur + pour créer un groupe</p>
              </div>
            ) : (
              <IonList>
                {groups.map((group) => (
                  <GroupItem
                    key={group.id}
                    group={group}
                    onClick={() => history.push(`/tabs/group-chat/${group.id}`)}
                  />
                ))}
              </IonList>
            )}
          </>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              if (segment === 'groupes') {
                history.push('/tabs/new-group');
              } else {
                setShowNewChat(true);
              }
            }}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showNewChat} onDidDismiss={() => setShowNewChat(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle><span className="toolbar-logo">Snapshoot</span></IonTitle>
              <IonButtons slot="end">
                <IonButton fill="clear" color="light" onClick={() => setShowNewChat(false)}>
                  Annuler
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => handleSearch(e.detail.value!)}
              placeholder="Rechercher par nom ou email..."
              debounce={300}
            />
            {searchResults.length === 0 && searchQuery.length > 0 && (
              <div className="messages-empty">
                <p>Aucun résultat pour "{searchQuery}"</p>
              </div>
            )}
            <IonList>
              {searchResults.map((user) => (
                <IonItem key={user.id} button onClick={() => openChatWith(user)}>
                  <IonAvatar slot="start">
                    <img src={user.avatar} alt={user.username} />
                  </IonAvatar>
                  <IonLabel>
                    <h2>{user.username}</h2>
                    <p>{user.email}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Messages;
