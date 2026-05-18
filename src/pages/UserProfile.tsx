import { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonToast,
  IonAlert,
} from '@ionic/react';
import AppHeader from '../components/AppHeader';
import { personAddOutline, personRemoveOutline, chatbubbleOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getUserById,
  addFriend,
  removeFriend,
  getOrCreateConversation,
  type User,
} from '../services/fakeApi';
import ProfileHeader from '../components/ProfileHeader';
import './Profile.css';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadProfile();
  }, [id]);

  function loadProfile() {
    if (!currentUser) return;
    const user = getUserById(id);
    if (!user) return;
    setProfileUser(user);

    const me = getUserById(currentUser.id);
    setIsFriend(me?.friends.includes(id) || false);
  }

  function handleAddFriend() {
    if (!currentUser || !profileUser) return;
    addFriend({ userId: currentUser.id, friendId: profileUser.id });
    setIsFriend(true);
    setToastMsg(`${profileUser.username} ajouté(e) à tes amis !`);
  }

  function handleRemoveFriend() {
    setShowRemoveAlert(true);
  }

  function confirmRemoveFriend() {
    if (!currentUser || !profileUser) return;
    removeFriend({ userId: currentUser.id, friendId: profileUser.id });
    setIsFriend(false);
    setToastMsg(`${profileUser.username} retiré(e) de tes amis.`);
  }

  function handleMessage() {
    if (!currentUser || !profileUser) return;
    const conv = getOrCreateConversation({ userId1: currentUser.id, userId2: profileUser.id });
    history.push(`/tabs/chat/${conv.id}`);
  }

  if (!profileUser) return null;

  return (
    <IonPage>
      <AppHeader title={profileUser.username} showBack />

      <IonContent>
        <ProfileHeader user={profileUser} />

        <div style={{ padding: '16px', display: 'flex', gap: '12px' }}>
          <IonButton expand="block" fill="outline" onClick={handleMessage} style={{ flex: 1 }}>
            <IonIcon icon={chatbubbleOutline} slot="start" />
            Message
          </IonButton>
          {isFriend ? (
            <IonButton expand="block" fill="outline" color="danger" onClick={handleRemoveFriend} style={{ flex: 1 }}>
              <IonIcon icon={personRemoveOutline} slot="start" />
              Retirer
            </IonButton>
          ) : (
            <IonButton expand="block" onClick={handleAddFriend} style={{ flex: 1 }}>
              <IonIcon icon={personAddOutline} slot="start" />
              Ajouter
            </IonButton>
          )}
        </div>

        <IonCard>
          <IonCardContent>
            <IonList lines="none">
              <IonItem>
                <IonLabel>
                  <IonText color="medium"><small>Email</small></IonText>
                  <p>{profileUser.email}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <IonText color="medium"><small>Ville</small></IonText>
                  <p>{profileUser.location.city}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <IonText color="medium"><small>ID utilisateur</small></IonText>
                  <p style={{ fontSize: '0.8rem', color: 'gray' }}>{profileUser.id}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2000}
          onDidDismiss={() => setToastMsg('')}
          position="bottom"
        />

        <IonAlert
          isOpen={showRemoveAlert}
          onDidDismiss={() => setShowRemoveAlert(false)}
          header="Retirer un ami"
          message={`Veux-tu vraiment retirer ${profileUser?.username} de tes amis ?`}
          buttons={[
            { text: 'Annuler', role: 'cancel' },
            { text: 'Retirer', role: 'destructive', handler: confirmRemoveFriend },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;
