import { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonAvatar,
  IonText,
  IonNote,
} from '@ionic/react';
import AppHeader from '../components/AppHeader';
import { useParams, useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getGroup,
  getUserById,
  editGroup,
  type User,
} from '../services/fakeApi';
import './Profile.css';

const EditGroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    const group = getGroup(id);
    if (!group) return;

    setGroupName(group.name);
    setDescription(group.description || '');

    const currentMembers = group.members.filter((mid) => mid !== currentUser.id);
    setSelectedIds(currentMembers);

    const allIds = new Set([...currentUser.friends, ...currentMembers]);
    const allUsers = Array.from(allIds)
      .map((uid) => getUserById(uid))
      .filter((u): u is User => !!u);
    setFriends(allUsers);
  }, [id]);

  function toggleUser(userId: string) {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  function handleSave() {
    setError('');
    if (!groupName.trim()) {
      setError('Le nom du groupe est requis.');
      return;
    }
    if (!currentUser) return;

    editGroup({
      groupId: id,
      name: groupName.trim(),
      description: description.trim(),
      memberIds: [currentUser.id, ...selectedIds],
    });

    history.goBack();
  }

  if (!currentUser) return null;

  return (
    <IonPage>
      <AppHeader title="Modifier le groupe" showBack />

      <IonContent>
        <div style={{ padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            className="profile-edit-input"
            placeholder="Nom du groupe *"
            value={groupName}
            maxLength={50}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <textarea
            className="profile-edit-input profile-edit-textarea"
            placeholder="Description (optionnel)"
            value={description}
            rows={2}
            maxLength={100}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && (
          <IonText color="danger">
            <p style={{ padding: '0 16px' }}>{error}</p>
          </IonText>
        )}

        <div style={{ padding: '16px 16px 4px' }}>
          <IonNote>
            Membres ({selectedIds.length + 1} sélectionné(s) dont vous)
          </IonNote>
        </div>

        <IonList>
          {friends.map((friend) => (
            <IonItem key={friend.id} button onClick={() => toggleUser(friend.id)}>
              <IonAvatar slot="start">
                <img src={friend.avatar} alt={friend.username} />
              </IonAvatar>
              <IonLabel>
                <h2>{friend.username}</h2>
                <p>{friend.location.city}</p>
              </IonLabel>
              <IonCheckbox
                slot="end"
                checked={selectedIds.includes(friend.id)}
                onIonChange={() => toggleUser(friend.id)}
              />
            </IonItem>
          ))}
        </IonList>

        <div style={{ padding: '16px' }}>
          <IonButton expand="block" onClick={handleSave}>
            Enregistrer
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditGroup;
