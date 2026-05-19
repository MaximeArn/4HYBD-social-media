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
  IonButton,
  IonModal,
  IonText,
  IonSpinner,
  IonAvatar,
} from '@ionic/react';
import AppHeader from '../components/AppHeader';
import { add, locationOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
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
  const history = useHistory();

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

  async function handleCameraPick() {
    try {
      const photo = await Camera.takePhoto({ quality: 80 });
      if (photo.thumbnail) {
        setNewImage(`data:image/jpeg;base64,${photo.thumbnail}`);
      } else if (photo.uri) {
        setNewImage(photo.uri);
      }
    } catch {
      // user cancelled
    }
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
      <AppHeader />

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="home-wrapper">
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
            <div className="stories-grid">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} onClick={setSelectedStory} />
              ))}
            </div>
          )}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowNewStory(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Story detail */}
        <IonModal isOpen={!!selectedStory} onDidDismiss={() => setSelectedStory(null)}>
          {selectedStory && (
            <IonPage>
              <IonHeader>
                <IonToolbar color="primary">
                  <IonTitle><span className="toolbar-logo">{selectedStory.user.username}</span></IonTitle>
                  <IonButton slot="end" fill="clear" color="light" onClick={() => setSelectedStory(null)}>Fermer</IonButton>
                </IonToolbar>
              </IonHeader>
              <IonContent scrollY={false}>
                <div className="story-viewer">
                  <div className="story-viewer-image">
                    <img src={selectedStory.imageUrl} alt="story" />
                  </div>
                  <div className="story-viewer-info">
                    <div
                      className="story-viewer-author"
                      onClick={() => { setSelectedStory(null); history.push(`/tabs/user/${selectedStory.user.id}`); }}
                    >
                      <IonAvatar className="story-viewer-avatar">
                        <img src={selectedStory.user.avatar} alt={selectedStory.user.username} />
                      </IonAvatar>
                      <div>
                        <strong>{selectedStory.user.username}</strong>
                        <p>{selectedStory.location.city} — {formatDistance(selectedStory.distance)}</p>
                      </div>
                    </div>
                    <p className="story-viewer-caption">{selectedStory.caption}</p>
                    <IonText color="medium">
                      <small>{formatTime(selectedStory.createdAt)}</small>
                    </IonText>
                  </div>
                </div>
              </IonContent>
            </IonPage>
          )}
        </IonModal>

        {/* New story */}
        <IonModal isOpen={showNewStory} onDidDismiss={() => setShowNewStory(false)}>
          <IonPage>
            <IonHeader>
              <IonToolbar color="primary">
                <IonTitle><span className="toolbar-logo">Nouvelle story</span></IonTitle>
                <IonButton slot="end" fill="clear" color="light" onClick={() => setShowNewStory(false)}>Annuler</IonButton>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="new-story-wrapper">
                <div className="new-story-image-picker">
                  {newImage ? (
                    <img src={newImage} alt="preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '300px', objectFit: 'cover' }} />
                  ) : (
                    <div className="image-placeholder">
                      <p>Ajouter une photo</p>
                    </div>
                  )}
                  {Capacitor.isNativePlatform() ? (
                    <button className="pick-image-btn" onClick={handleCameraPick}>
                      <span>Prendre une photo</span>
                    </button>
                  ) : (
                    <label className="pick-image-btn">
                      <span>Choisir une photo</span>
                      <input type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                <textarea
                  className="new-story-textarea"
                  placeholder="Dis quelque chose..."
                  value={newCaption}
                  rows={3}
                  onChange={(e) => setNewCaption(e.target.value)}
                />

                <div className="new-story-location">
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
