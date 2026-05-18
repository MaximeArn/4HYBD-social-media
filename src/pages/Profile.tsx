import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonAlert,
  IonToast,
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
import ProfileHeader from '../components/ProfileHeader';
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
        <div className="profile-wrapper">
          <ProfileHeader
            user={user}
            editing={editing}
            friendsCount={!editing ? user.friends.length : undefined}
          />

          {editing ? (
            <div className="profile-edit-form">
              <input
                placeholder="Nom d'utilisateur"
                value={username}
                maxLength={30}
                onChange={(e) => setUsername(e.target.value)}
              />
              <textarea
                placeholder="Bio"
                value={bio}
                maxLength={150}
                rows={3}
                onChange={(e) => setBio(e.target.value)}
              />
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                {VILLES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <IonButton expand="block" onClick={handleSave}>
                Sauvegarder
              </IonButton>
            </div>
          ) : (
            <div className="profile-info-section">
              <div className="profile-info-card">
                <div className="profile-info-row">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{user.email}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Ville</span>
                  <span className="profile-info-value">{user.location.city}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">ID</span>
                  <span className="profile-info-value" style={{ fontSize: '0.75rem', color: '#aaa' }}>{user.id}</span>
                </div>
              </div>
            </div>
          )}

          <div className="profile-actions">
            <IonButton expand="block" fill="outline" color="medium" onClick={() => setShowLogoutAlert(true)}>
              <IonIcon icon={logOutOutline} slot="start" />
              Se déconnecter
            </IonButton>
            <IonButton expand="block" fill="outline" color="danger" onClick={() => setShowDeleteAlert(true)}>
              <IonIcon icon={trashOutline} slot="start" />
              Supprimer mon compte
            </IonButton>
          </div>
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
