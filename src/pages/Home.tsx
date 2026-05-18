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
  IonTextarea,
  IonButton,
  IonModal,
  IonText,
  IonSpinner,
  IonAvatar,
} from '@ionic/react';
import { add, locationOutline } from 'ionicons/icons';
import {
  getCurrentUser,
  getStoriesNearby,
  createStory,
  formatTime,
  formatDistance,
  type Story,
  type User,
} from '../services/fakeApi';
import StoryCard from '../components/StoryCard';
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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const result = getStoriesNearby({ lat: pos.coords.latitude, lng: pos.coords.longitude, radiusKm: 1000 });
          setStories(result);
          setLoading(false);
        },
        () => {
          const result = getStoriesNearby({ lat: currentUser.location.lat, lng: currentUser.location.lng, radiusKm: 1000 });
          setStories(result);
          setLoading(false);
        }
      );
    } else {
      const result = getStoriesNearby({ lat: currentUser.location.lat, lng: currentUser.location.lng, radiusKm: 1000 });
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
    createStory({ userId: currentUser.id, caption: newCaption, imageUrl });
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
          <IonTitle>Snapshoot</IonTitle>
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
            <p>Aucune story dans ta zone.</p>
            <p>Sois le premier à publier !</p>
          </div>
        ) : (
          <div className="stories-list">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} onClick={setSelectedStory} />
            ))}
          </div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowNewStory(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

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
                        {selectedStory.location.city} — {formatDistance(selectedStory.distance)}
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
                      <p>Ajouter une photo</p>
                    </div>
                  )}
                  <label className="pick-image-btn">
                    <span>Choisir une photo</span>
                    <input type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} />
                  </label>
                </div>

                <IonTextarea
                  placeholder="Dis quelque chose..."
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
