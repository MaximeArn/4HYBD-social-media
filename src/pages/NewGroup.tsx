import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonCheckbox,
  IonButton,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonText,
  IonNote,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getUsers,
  createGroup,
  type User,
} from '../services/fakeApi';

const NewGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    const others = getUsers().filter((u) => u.id !== currentUser.id);
    setAllUsers(others);
  }, []);

  function toggleUser(userId: string) {
    if (selectedIds.includes(userId)) {
      setSelectedIds(selectedIds.filter((id) => id !== userId));
    } else {
      setSelectedIds([...selectedIds, userId]);
    }
  }

  function handleCreate() {
    setError('');
    if (!groupName.trim()) {
      setError('Donne un nom au groupe.');
      return;
    }
    if (selectedIds.length === 0) {
      setError('Sélectionne au moins un membre.');
      return;
    }
    if (!currentUser) return;

    const newGroup = createGroup({ name: groupName.trim(), description: description.trim(), memberIds: selectedIds, createdBy: currentUser.id });
    history.replace(`/tabs/group-chat/${newGroup.id}`);
  }

  if (!currentUser) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/messages" />
          </IonButtons>
          <IonTitle>Nouveau groupe</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" color="light" onClick={handleCreate}>
              Créer
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Nom du groupe *</IonLabel>
            <IonInput
              value={groupName}
              onIonInput={(e) => setGroupName(e.detail.value!)}
              maxlength={50}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Description (optionnel)</IonLabel>
            <IonTextarea
              value={description}
              onIonInput={(e) => setDescription(e.detail.value!)}
              rows={2}
              maxlength={100}
            />
          </IonItem>
        </IonList>

        {error && (
          <IonText color="danger">
            <p style={{ padding: '8px 16px' }}>{error}</p>
          </IonText>
        )}

        <div style={{ padding: '16px 16px 4px' }}>
          <IonNote>
            Sélectionner les membres ({selectedIds.length} sélectionné(s))
          </IonNote>
        </div>

        <IonList>
          {allUsers.map((user) => (
            <IonItem key={user.id} button onClick={() => toggleUser(user.id)}>
              <IonAvatar slot="start">
                <img src={user.avatar} alt={user.username} />
              </IonAvatar>
              <IonLabel>
                <h2>{user.username}</h2>
                <p>{user.location.city}</p>
              </IonLabel>
              <IonCheckbox
                slot="end"
                checked={selectedIds.includes(user.id)}
                onIonChange={() => toggleUser(user.id)}
              />
            </IonItem>
          ))}
        </IonList>

        <div style={{ padding: '16px' }}>
          <IonButton expand="block" onClick={handleCreate}>
            Créer le groupe
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NewGroup;
