import { IonAvatar } from '@ionic/react';
import type { User } from '../services/fakeApi';

interface Props {
  user: User;
  editing?: boolean;
}

const ProfileHeader: React.FC<Props> = ({ user, editing = false }) => {
  return (
    <div className="profile-header">
      <IonAvatar className="profile-avatar">
        <img src={user.avatar} alt={user.username} />
      </IonAvatar>
      {editing ? (
        <p style={{ color: 'white', opacity: 0.8, fontSize: '0.85rem' }}>Mode édition</p>
      ) : (
        <>
          <h2 className="profile-username">{user.username}</h2>
          <p className="profile-bio">{user.bio || 'Pas de bio'}</p>
          <p className="profile-location">{user.location.city}</p>
        </>
      )}
    </div>
  );
};

export default ProfileHeader;
