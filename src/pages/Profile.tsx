import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonAlert,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonText,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { logOutOutline, trashOutline, createOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  updateUser,
  deleteUser,
  logout,
  type User,
} from '../services/fakeApi';
import './Profile.css';

const VILLES = [
  'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse',
  'Lille', 'Nantes', 'Strasbourg', 'Nice', 'Montpellier',
];

const COORDS: Record<string, { lat: number; lng: number }> = {
  Paris: { lat: 48.8566, lng: 2.3522 },
  Lyon: { lat: 45.764, lng: 4.8357 },
  Marseille: { lat: 43.2965, lng: 5.3698 },
  Bordeaux: { lat: 44.8378, lng: -0.5792 },
  Toulouse: { lat: 43.6047, lng: 1.4442 },
  Lille: { lat: 50.6292, lng: 3.0573 },
  Nantes: { lat: 47.2184, lng: -1.5536 },
  Strasbourg: { lat: 48.5734, lng: 7.7521 },
  Nice: { lat: 43.7102, lng: 7.262 },
  Montpellier: { lat: 43.6119, lng: 3.8772 },
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();

  useEffect(() => {
    loadUser();
  }, []);

  function loadUser() {
    const current = getCurrentUser();
    if (!current) {
      history.replace('/login');
      return;
    }
    setUser(current);
    setUsername(current.username);
    setBio(current.bio);
    setCity(current.location.city);
  }

  function handleSave() {
    if (!user || !username.trim()) return;
    const coords = COORDS[city] || user.location;
    const updated = updateUser(user.id, {
      username: username.trim(),
      bio: bio.trim(),
      location: { ...coords, city },
    });
    if (updated) {
      setUser(updated);
      setEditing(false);
      setToastMsg('Profil mis à jour !');
    }
  }

  function handleCancelEdit() {
    if (!user) return;
    setUsername(user.username);
    setBio(user.bio);
    setCity(user.location.city);
    setEditing(false);
  }

  function handleLogout() {
    logout();
    history.replace('/login');
  }

  function handleDelete() {
    if (!user) return;
    deleteUser(user.id);
    history.replace('/login');
  }

  if (!user) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mon profil</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            color="light"
            onClick={() => (editing ? handleSave() : setEditing(true))}
          >
            <IonIcon icon={editing ? checkmarkOutline : createOutline} />
          </IonButton>
          {editing && (
            <IonButton slot="end" fill="clear" color="light" onClick={handleCancelEdit}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* En-tête du profil */}
        <div className="profile-header">
          <IonAvatar className="profile-avatar">
            <img src={user.avatar} alt={user.username} />
          </IonAvatar>
          {!editing ? (
            <>
              <h2 className="profile-username">{user.username}</h2>
              <p className="profile-bio">{user.bio || 'Pas de bio'}</p>
              <p className="profile-location">{user.location.city}</p>
            </>
          ) : (
            <p style={{ color: 'white', opacity: 0.8, fontSize: '0.85rem' }}>Mode édition</p>
          )}
        </div>

        {/* Formulaire d'édition */}
        {editing && (
          <IonCard className="edit-card">
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel position="floating">Nom d'utilisateur</IonLabel>
                  <IonInput
                    value={username}
                    onIonInput={(e) => setUsername(e.detail.value!)}
                    maxlength={30}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Bio</IonLabel>
                  <IonTextarea
                    value={bio}
                    onIonInput={(e) => setBio(e.detail.value!)}
                    rows={2}
                    maxlength={150}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Ville</IonLabel>
                  <IonSelect value={city} onIonChange={(e) => setCity(e.detail.value)}>
                    {VILLES.map((v) => (
                      <IonSelectOption key={v} value={v}>
                        {v}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonList>
              <IonButton expand="block" onClick={handleSave} style={{ marginTop: '12px' }}>
                Sauvegarder
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* Infos du compte */}
        {!editing && (
          <IonCard>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonLabel>
                    <IonText color="medium"><small>Email</small></IonText>
                    <p>{user.email}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <IonText color="medium"><small>Localisation</small></IonText>
                    <p>{user.location.city} ({user.location.lat.toFixed(4)}, {user.location.lng.toFixed(4)})</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <IonText color="medium"><small>Amis</small></IonText>
                    <p>{user.friends.length} ami(s)</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <IonText color="medium"><small>ID utilisateur</small></IonText>
                    <p style={{ fontSize: '0.8rem', color: 'gray' }}>{user.id}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Actions du compte */}
        <div className="profile-actions">
          <IonButton
            expand="block"
            fill="outline"
            color="medium"
            onClick={() => setShowLogoutAlert(true)}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Se déconnecter
          </IonButton>
          <IonButton
            expand="block"
            fill="outline"
            color="danger"
            onClick={() => setShowDeleteAlert(true)}
          >
            <IonIcon icon={trashOutline} slot="start" />
            Supprimer mon compte
          </IonButton>
        </div>

        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header="Se déconnecter"
          message="Tu vas être déconnecté(e). À bientôt !"
          buttons={[
            { text: 'Annuler', role: 'cancel' },
            { text: 'Se déconnecter', handler: handleLogout },
          ]}
        />

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Supprimer le compte"
          message="Cette action est irréversible. Ton compte sera définitivement supprimé."
          buttons={[
            { text: 'Annuler', role: 'cancel' },
            { text: 'Supprimer', role: 'destructive', handler: handleDelete },
          ]}
        />

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

export default Profile;
