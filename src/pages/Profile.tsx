import { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonToast,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from '@ionic/react';
import {
  createOutline,
  checkmarkOutline,
  closeOutline,
  locationOutline,
  imagesOutline,
  settingsOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  updateUser,
  getStoriesByUser,
  type User,
  type Story,
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
  const [stories, setStories] = useState<Story[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();

  useEffect(() => {
    loadUser();
  }, []);

  function loadUser() {
    const current = getCurrentUser();
    if (!current) { history.replace('/login'); return; }
    setUser(current);
    setUsername(current.username);
    setBio(current.bio);
    setCity(current.location.city);
    setStories(getStoriesByUser(current.id));
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
      setShowEditModal(false);
      setToastMsg('Profil mis à jour !');
    }
  }

  function handleCancelEdit() {
    if (!user) return;
    setUsername(user.username);
    setBio(user.bio);
    setCity(user.location.city);
    setShowEditModal(false);
  }


  if (!user) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle><span className="toolbar-logo">BeUnreal</span></IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" color="light" onClick={() => history.push('/tabs/settings')}>
              <IonIcon icon={settingsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Hero */}
        <div className="profile-hero">
          <IonAvatar className="profile-avatar">
            <img src={user.avatar} alt={user.username} />
          </IonAvatar>
          <h2 className="profile-username">{user.username}</h2>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <p className="profile-location">
            <IonIcon icon={locationOutline} />
            {user.location.city}
          </p>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{stories.length}</span>
            <span className="profile-stat-label">Stories</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-value">{user.friends.length}</span>
            <span className="profile-stat-label">Amis</span>
          </div>
        </div>

        {/* Edit button */}
        <div className="profile-edit-btn-row">
          <IonButton fill="outline" expand="block" onClick={() => setShowEditModal(true)}>
            <IonIcon icon={createOutline} slot="start" />
            Modifier le profil
          </IonButton>
        </div>

        {/* Stories grid */}
        {stories.length === 0 ? (
          <div className="profile-empty-stories">
            <IonIcon icon={imagesOutline} />
            <p>Aucune story publiée</p>
          </div>
        ) : (
          <div className="profile-stories-grid">
            {stories.map((story) => (
              <div key={story.id} className="profile-story-thumb">
                <img src={story.imageUrl} alt={story.caption} />
              </div>
            ))}
          </div>
        )}
      </IonContent>

      {/* Edit modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCancelEdit}>
        <IonPage>
          <IonHeader>
            <IonToolbar color="primary">
              <IonButtons slot="start">
                <IonButton fill="clear" color="light" onClick={handleCancelEdit}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
              <IonTitle><span className="toolbar-logo">Modifier le profil</span></IonTitle>
              <IonButtons slot="end">
                <IonButton fill="clear" color="light" onClick={handleSave}>
                  <IonIcon icon={checkmarkOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            <div className="profile-edit-form">
              <div className="profile-edit-avatar-row">
                <IonAvatar className="profile-edit-avatar">
                  <img src={user.avatar} alt={user.username} />
                </IonAvatar>
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label">Nom d'utilisateur</label>
                <input
                  className="profile-edit-input"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  maxLength={30}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label">Bio</label>
                <textarea
                  className="profile-edit-input profile-edit-textarea"
                  placeholder="Parle de toi..."
                  value={bio}
                  maxLength={150}
                  rows={3}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label">Ville</label>
                <select
                  className="profile-edit-input profile-edit-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {VILLES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <IonButton expand="block" onClick={handleSave} style={{ marginTop: '8px' }}>
                Sauvegarder les modifications
              </IonButton>

            </div>
          </IonContent>
        </IonPage>
      </IonModal>


      <IonToast
        isOpen={!!toastMsg}
        message={toastMsg}
        duration={2000}
        onDidDismiss={() => setToastMsg('')}
        position="bottom"
      />
    </IonPage>
  );
};

export default Profile;
