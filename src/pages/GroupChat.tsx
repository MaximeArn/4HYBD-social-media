import { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonAlert,
  IonActionSheet,
} from '@ionic/react';
import { ellipsisVertical, exitOutline, informationCircleOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getGroup,
  sendGroupMessage,
  getUserById,
  leaveGroup,
  type Message,
  type Group,
} from '../services/fakeApi';
import MessageBubble from '../components/MessageBubble';
import ChatInputBar from '../components/ChatInputBar';
import './Chat.css';
import './GroupChat.css';

const GroupChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const history = useHistory();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadGroup();
  }, [id]);

  useEffect(() => {
    setTimeout(() => contentRef.current?.scrollToBottom(200), 100);
  }, [messages]);

  function loadGroup() {
    const g = getGroup(id);
    if (!g) return;
    setGroup(g);
    setMessages([...g.messages]);
  }

  function handleSendText(text: string) {
    if (!currentUser || !group) return;
    sendGroupMessage({ groupId: group.id, senderId: currentUser.id, content: text });
    loadGroup();
  }

  function handleImageSend(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !group) return;
    const reader = new FileReader();
    reader.onload = () => {
      sendGroupMessage({ groupId: group.id, senderId: currentUser.id, content: 'Photo', type: 'image', imageUrl: reader.result as string });
      loadGroup();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleLeaveGroup() {
    if (!currentUser || !group) return;
    leaveGroup({ groupId: group.id, userId: currentUser.id });
    history.replace('/tabs/messages');
  }

  if (!currentUser || !group) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/messages" />
          </IonButtons>
          <IonTitle>
            <div className="group-title">
              <span>{group.name}</span>
              <small>{group.members.length} membres</small>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" color="light" onClick={() => setShowActionSheet(true)}>
              <IonIcon icon={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} className="chat-content">
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>Bienvenue dans le groupe !</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const sender = getUserById(msg.senderId);
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMe={isMe}
                sender={isMe ? undefined : sender}
                showSenderName
              />
            );
          })}
        </div>
      </IonContent>

      <ChatInputBar onSend={handleSendText} onImageSend={handleImageSend} />

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        header={group.name}
        buttons={[
          {
            text: `Membres (${group.members.length})`,
            icon: informationCircleOutline,
            handler: () => {
              const memberNames = group.members
                .map((mid) => getUserById(mid)?.username || mid)
                .join(', ');
              alert('Membres : ' + memberNames);
            },
          },
          {
            text: 'Quitter le groupe',
            icon: exitOutline,
            role: 'destructive',
            handler: () => setShowLeaveAlert(true),
          },
          {
            text: 'Annuler',
            role: 'cancel',
          },
        ]}
      />

      <IonAlert
        isOpen={showLeaveAlert}
        onDidDismiss={() => setShowLeaveAlert(false)}
        header="Quitter le groupe"
        message={`Tu vas quitter "${group.name}". Es-tu sûr ?`}
        buttons={[
          { text: 'Annuler', role: 'cancel' },
          { text: 'Quitter', role: 'destructive', handler: handleLeaveGroup },
        ]}
      />
    </IonPage>
  );
};

export default GroupChat;
