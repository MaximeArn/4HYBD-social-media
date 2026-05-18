import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonAlert,
  IonText,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getGroup,
  getUserById,
  leaveGroup,
  type User,
} from '../services/fakeApi';
import './Settings.css';

const GroupSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const history = useHistory();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const group = getGroup(id);
    if (!group) return;
    setGroupName(group.name);
    setGroupDescription(group.description || '');
    setCreatedBy(group.createdBy);
    setMembers(group.members.map((mid) => getUserById(mid)).filter((u): u is User => !!u));
  }, [id]);

  function handleLeave() {
    if (!currentUser) return;
    leaveGroup({ groupId: id, userId: currentUser.id });
    history.replace('/tabs/messages');
  }

  function goToProfile(userId: string) {
    if (currentUser && userId === currentUser.id) {
      history.push('/tabs/profile');
    } else {
      history.push(`/tabs/user/${userId}`);
    }
  }

  if (!currentUser) return null;

  const isAdmin = currentUser.id === createdBy;

  return (
    <IonPage>
          <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton fill="clear" color="light" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle><span className="toolbar-logo">Paramètres</span></IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="settings-section">
          <p className="settings-section-title">Groupe</p>
          <IonList className="settings-list">
            <IonItem lines="none">
              <IonLabel>
                <h2>{groupName}</h2>
                {groupDescription ? <p>{groupDescription}</p> : null}
              </IonLabel>
            </IonItem>
          </IonList>
        </div>

        <div className="settings-section">
          <p className="settings-section-title">Membres ({members.length})</p>
          <IonList className="settings-list">
            {members.map((member) => (
              <IonItem key={member.id} button onClick={() => goToProfile(member.id)}>
                <IonAvatar slot="start">
                  <img src={member.avatar} alt={member.username} />
                </IonAvatar>
                <IonLabel>
                  <h2>
                    {member.username}
                    {member.id === currentUser.id && (
                      <IonText color="medium"> (moi)</IonText>
                    )}
                  </h2>
                  <p>{member.email}</p>
                </IonLabel>
                {member.id === createdBy && (
                  <IonBadge slot="end" color="primary">Admin</IonBadge>
                )}
              </IonItem>
            ))}
          </IonList>
        </div>

        <div style={{ padding: '32px 16px 8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isAdmin && (
            <IonButton expand="block" fill="outline" onClick={() => history.push(`/tabs/edit-group/${id}`)}>
              Modifier le groupe
            </IonButton>
          )}
          <IonButton expand="block" color="danger" fill="outline" onClick={() => setShowLeaveAlert(true)}>
            Quitter le groupe
          </IonButton>
        </div>

        <IonAlert
          isOpen={showLeaveAlert}
          onDidDismiss={() => setShowLeaveAlert(false)}
          header="Quitter le groupe"
          message={`Tu vas quitter "${groupName}". Es-tu sûr ?`}
          buttons={[
            { text: 'Annuler', role: 'cancel' },
            { text: 'Quitter', role: 'destructive', handler: handleLeave },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default GroupSettings;
