import {
  IonCard,
  IonCardContent,
  IonAvatar,
  IonChip,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import { formatTime, formatDistance, type Story, type User } from '../services/fakeApi';

type StoryWithUser = Story & { user: User; distance: number };

interface Props {
  story: StoryWithUser;
  onClick: (story: StoryWithUser) => void;
}

const StoryCard: React.FC<Props> = ({ story, onClick }) => {
  return (
    <IonCard className="story-card" onClick={() => onClick(story)}>
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
  );
};

export default StoryCard;
