import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonToast,
} from '@ionic/react';
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
import './Profile.css';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isFriend, setIsFriend] = useState(false);
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
    addFriend(currentUser.id, profileUser.id);
    setIsFriend(true);
    setToastMsg(`${profileUser.username} ajouté(e) à tes amis !`);
  }

  function handleRemoveFriend() {
    if (!currentUser || !profileUser) return;
    removeFriend(currentUser.id, profileUser.id);
    setIsFriend(false);
    setToastMsg(`${profileUser.username} retiré(e) de tes amis.`);
  }

  function handleMessage() {
    if (!currentUser || !profileUser) return;
    const conv = getOrCreateConversation(currentUser.id, profileUser.id);
    history.push(`/tabs/chat/${conv.id}`);
  }

  if (!profileUser) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{profileUser.username}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="profile-header">
          <IonAvatar className="profile-avatar">
            <img src={profileUser.avatar} alt={profileUser.username} />
          </IonAvatar>
          <h2 className="profile-username">{profileUser.username}</h2>
          <p className="profile-bio">{profileUser.bio || 'Pas de bio'}</p>
          <p className="profile-location">📍 {profileUser.location.city}</p>
        </div>

        {/* Boutons d'action */}
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

        {/* Infos du profil */}
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
                  <p>📍 {profileUser.location.city}</p>
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
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;
