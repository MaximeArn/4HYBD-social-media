import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react';
import { chatbubbleOutline, personAddOutline, personRemoveOutline } from 'ionicons/icons';
import type { User } from '../services/fakeApi';

interface Props {
  user: User;
  onViewProfile: (id: string) => void;
  showEmail?: boolean;
  onMessage?: () => void;
  isFriend?: boolean;
  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
  iconActions?: boolean;
}

const UserListItem: React.FC<Props> = ({
  user,
  onViewProfile,
  showEmail = false,
  onMessage,
  isFriend,
  onAddFriend,
  onRemoveFriend,
  iconActions = false,
}) => {
  return (
    <IonItem>
      <IonAvatar slot="start" onClick={() => onViewProfile(user.id)}>
        <img src={user.avatar} alt={user.username} />
      </IonAvatar>
      <IonLabel onClick={() => onViewProfile(user.id)}>
        <h2>{user.username}</h2>
        <p>{user.location.city}</p>
        {showEmail && (
          <IonText color="medium">
            <small>{user.email}</small>
          </IonText>
        )}
      </IonLabel>
      {onMessage && (
        <IonButton fill="clear" onClick={onMessage}>
          <IonIcon icon={chatbubbleOutline} />
        </IonButton>
      )}
      {iconActions ? (
        onRemoveFriend && (
          <IonButton fill="clear" color="danger" onClick={onRemoveFriend}>
            <IonIcon icon={personRemoveOutline} />
          </IonButton>
        )
      ) : (
        isFriend ? (
          onRemoveFriend && (
            <IonButton fill="outline" color="danger" size="small" onClick={onRemoveFriend}>
              <IonIcon icon={personRemoveOutline} slot="start" />
              Retirer
            </IonButton>
          )
        ) : (
          onAddFriend && (
            <IonButton fill="solid" color="primary" size="small" onClick={onAddFriend}>
              <IonIcon icon={personAddOutline} slot="start" />
              Ajouter
            </IonButton>
          )
        )
      )}
    </IonItem>
  );
};

export default UserListItem;
