import { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { ellipsisVertical, arrowBack } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getGroup,
  sendGroupMessage,
  getUserById,
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

  if (!currentUser || !group) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton fill="clear" color="light" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle><span className="toolbar-logo">{group.name}</span></IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" color="light" onClick={() => history.push(`/tabs/group-settings/${group.id}`)}>
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
                me={isMe ? currentUser : undefined}
                showSenderName
                onAvatarClick={(userId) => history.push(userId === currentUser.id ? '/tabs/profile' : `/tabs/user/${userId}`)}
              />
            );
          })}
        </div>
      </IonContent>

      <ChatInputBar onSend={handleSendText} onImageSend={handleImageSend} />
    </IonPage>
  );
};

export default GroupChat;
