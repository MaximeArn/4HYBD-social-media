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
  IonText,
  IonNote,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonSearchbar,
  IonButton,
  IonButtons,
} from '@ionic/react';
import { add, peopleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getConversations,
  getGroups,
  getOrCreateConversation,
  searchUsers,
  formatTime,
  type User,
} from '../services/fakeApi';
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
    if (!currentUser) return;
    setConversations(getConversations(currentUser.id));
    setGroups(getGroups(currentUser.id));
  }, []);

  useEffect(() => {
    if (!showNewChat) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [showNewChat]);

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchUsers(query));
    } else {
      setSearchResults([]);
    }
  }

  function openChatWith(user: User) {
    if (!currentUser) return;
    const conv = getOrCreateConversation(currentUser.id, user.id);
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
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Messages</IonTitle>
        </IonToolbar>
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
                <p>💬 Aucune conversation</p>
                <p>Appuie sur + pour écrire à quelqu'un</p>
              </div>
            ) : (
              <IonList>
                {conversations.map((conv) => (
                  <IonItem
                    key={conv.id}
                    button
                    onClick={() => history.push(`/tabs/chat/${conv.id}`)}
                    detail
                  >
                    <IonAvatar slot="start">
                      <img src={conv.otherUser.avatar} alt={conv.otherUser.username} />
                    </IonAvatar>
                    <IonLabel>
                      <h2>{conv.otherUser.username}</h2>
                      {conv.lastMessage && (
                        <p>
                          {conv.lastMessage.type === 'image'
                            ? '📷 Photo'
                            : conv.lastMessage.content}
                        </p>
                      )}
                    </IonLabel>
                    {conv.lastMessage && (
                      <IonNote slot="end" className="message-time">
                        {formatTime(conv.lastMessage.timestamp)}
                      </IonNote>
                    )}
                  </IonItem>
                ))}
              </IonList>
            )}
          </>
        )}

        {segment === 'groupes' && (
          <>
            {groups.length === 0 ? (
              <div className="messages-empty">
                <p>👥 Aucun groupe</p>
                <p>Appuie sur + pour créer un groupe</p>
              </div>
            ) : (
              <IonList>
                {groups.map((group) => (
                  <IonItem
                    key={group.id}
                    button
                    onClick={() => history.push(`/tabs/group-chat/${group.id}`)}
                    detail
                  >
                    <div slot="start" className="group-icon">
                      <IonIcon icon={peopleOutline} />
                    </div>
                    <IonLabel>
                      <h2>{group.name}</h2>
                      <p>
                        {group.lastMessage
                          ? group.lastMessage.type === 'image'
                            ? '📷 Photo'
                            : group.lastMessage.content
                          : group.description || `${group.members.length} membres`}
                      </p>
                    </IonLabel>
                    {group.lastMessage && (
                      <IonNote slot="end" className="message-time">
                        {formatTime(group.lastMessage.timestamp)}
                      </IonNote>
                    )}
                  </IonItem>
                ))}
              </IonList>
            )}
          </>
        )}

        {/* FAB : nouveau chat direct OU nouveau groupe */}
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

        {/* Modal : chercher un utilisateur pour démarrer une conv */}
        <IonModal isOpen={showNewChat} onDidDismiss={() => setShowNewChat(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Nouvelle conversation</IonTitle>
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
