import { IonAvatar } from '@ionic/react';
import type { User } from '../services/fakeApi';

interface Props {
  user: User;
  editing?: boolean;
  friendsCount?: number;
}

const ProfileHeader: React.FC<Props> = ({ user, editing = false, friendsCount }) => {
  return (
    <div className="profile-hero">
      <div className="profile-avatar-row">
        <IonAvatar className="profile-avatar">
          <img src={user.avatar} alt={user.username} />
        </IonAvatar>
      </div>

      <div className="profile-identity">
        {editing ? (
          <p className="profile-editing-label">Modification du profil</p>
        ) : (
          <>
            <h2 className="profile-username">{user.username}</h2>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            <p className="profile-city">{user.location.city}</p>
          </>
        )}
      </div>

      {!editing && friendsCount !== undefined && (
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{friendsCount}</span>
            <span className="profile-stat-label">Amis</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
