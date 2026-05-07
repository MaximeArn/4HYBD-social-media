import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonAlert,
  IonTextarea,
  IonButton,
  IonModal,
  IonText,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonChip,
  IonLabel,
} from '@ionic/react';
import { add, locationOutline, timeOutline } from 'ionicons/icons';
import {
  getCurrentUser,
  getStoriesNearby,
  createStory,
  formatTime,
  formatDistance,
  type Story,
  type User,
} from '../services/fakeApi';
import './Home.css';

type StoryWithUser = Story & { user: User; distance: number };

const Home: React.FC = () => {
  const [stories, setStories] = useState<StoryWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewStory, setShowNewStory] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState('');
  const [selectedStory, setSelectedStory] = useState<StoryWithUser | null>(null);

  const currentUser = getCurrentUser();

  function loadStories() {
    if (!currentUser) return;
    setLoading(true);

    // On utilise la position GPS du navigateur si disponible,
    // sinon on utilise la localisation stockée dans le profil
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const result = getStoriesNearby(pos.coords.latitude, pos.coords.longitude, 1000);
          setStories(result);
          setLoading(false);
        },
        () => {
          // L'utilisateur a refusé la géoloc : on utilise sa ville du profil
          const result = getStoriesNearby(currentUser.location.lat, currentUser.location.lng, 1000);
          setStories(result);
          setLoading(false);
        }
      );
    } else {
      const result = getStoriesNearby(currentUser.location.lat, currentUser.location.lng, 1000);
      setStories(result);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStories();
  }, []);

  function handleRefresh(event: CustomEvent) {
    loadStories();
    setTimeout(() => (event.detail as any).complete(), 1000);
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handlePostStory() {
    if (!currentUser || !newCaption) return;
    const imageUrl = newImage || `https://picsum.photos/seed/${Date.now()}/400/700`;
    createStory(currentUser.id, newCaption, imageUrl);
    setNewCaption('');
    setNewImage('');
    setShowNewStory(false);
    loadStories();
  }

  if (!currentUser) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>📸 Snapshoot</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="home-location-bar">
          <IonIcon icon={locationOutline} />
          <span>Autour de {currentUser.location.city} — {stories.length} story(s)</span>
        </div>

        {loading ? (
          <div className="home-loading">
            <IonSpinner name="crescent" />
            <p>Recherche des stories proches...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="home-empty">
            <p>😶 Aucune story dans ta zone.</p>
            <p>Sois le premier à publier !</p>
          </div>
        ) : (
          <div className="stories-list">
            {stories.map((story) => (
              <IonCard key={story.id} className="story-card" onClick={() => setSelectedStory(story)}>
                <div className="story-image-container">
                  <img src={story.imageUrl} alt="story" className="story-image" />
                  <div className="story-overlay">
                    <div className="story-user-info">
                      <IonAvatar className="story-avatar">
                        <img src={story.user.avatar} alt={story.user.username} />
                      </IonAvatar>
                      <span className="story-username">{story.user.username}</span>
                    </div>
                    <div className="story-chips">
                      <IonChip className="story-chip">
                        <IonIcon icon={locationOutline} />
                        <IonLabel>{formatDistance(story.distance)}</IonLabel>
                      </IonChip>
                      <IonChip className="story-chip">
                        <IonIcon icon={timeOutline} />
                        <IonLabel>{formatTime(story.createdAt)}</IonLabel>
                      </IonChip>
                    </div>
                  </div>
                </div>
                <IonCardContent className="story-caption">
                  <p>{story.caption}</p>
                  <small>{story.location.city}</small>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {/* FAB pour publier une nouvelle story */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowNewStory(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal : détail d'une story */}
        <IonModal isOpen={!!selectedStory} onDidDismiss={() => setSelectedStory(null)}>
          {selectedStory && (
            <IonPage>
              <IonHeader>
                <IonToolbar color="primary">
                  <IonTitle>{selectedStory.user.username}</IonTitle>
                  <IonButton slot="end" fill="clear" color="light" onClick={() => setSelectedStory(null)}>
                    Fermer
                  </IonButton>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <img src={selectedStory.imageUrl} alt="story" style={{ width: '100%' }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <IonAvatar style={{ width: '48px', height: '48px' }}>
                      <img src={selectedStory.user.avatar} alt={selectedStory.user.username} />
                    </IonAvatar>
                    <div>
                      <strong>{selectedStory.user.username}</strong>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'gray' }}>
                        📍 {selectedStory.location.city} — {formatDistance(selectedStory.distance)}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '1rem' }}>{selectedStory.caption}</p>
                  <IonText color="medium">
                    <small>{formatTime(selectedStory.createdAt)}</small>
                  </IonText>
                </div>
              </IonContent>
            </IonPage>
          )}
        </IonModal>

        {/* Modal : publier une nouvelle story */}
        <IonModal isOpen={showNewStory} onDidDismiss={() => setShowNewStory(false)}>
          <IonPage>
            <IonHeader>
              <IonToolbar color="primary">
                <IonTitle>Nouvelle story</IonTitle>
                <IonButton slot="end" fill="clear" color="light" onClick={() => setShowNewStory(false)}>
                  Annuler
                </IonButton>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div style={{ padding: '16px' }}>
                <div className="new-story-image-picker">
                  {newImage ? (
                    <img src={newImage} alt="preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '300px', objectFit: 'cover' }} />
                  ) : (
                    <div className="image-placeholder">
                      <p>📷 Ajouter une photo</p>
                    </div>
                  )}
                  <label className="pick-image-btn">
                    <span>Choisir une photo</span>
                    <input type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} />
                  </label>
                </div>

                <IonTextarea
                  placeholder="Dis quelque chose... ✍️"
                  value={newCaption}
                  onIonInput={(e) => setNewCaption(e.detail.value!)}
                  rows={3}
                  style={{ marginTop: '16px' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: 'gray', fontSize: '0.85rem' }}>
                  <IonIcon icon={locationOutline} />
                  <span>Publié depuis {currentUser.location.city}</span>
                </div>

                <IonButton
                  expand="block"
                  onClick={handlePostStory}
                  disabled={!newCaption}
                  style={{ marginTop: '20px' }}
                >
                  Publier ma story
                </IonButton>
              </div>
            </IonContent>
          </IonPage>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
