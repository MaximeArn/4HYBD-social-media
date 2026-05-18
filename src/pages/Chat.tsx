import { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getConversation,
  sendMessage,
  getUserById,
  type Message,
  type User,
  type Conversation,
} from '../services/fakeApi';
import MessageBubble from '../components/MessageBubble';
import ChatInputBar from '../components/ChatInputBar';
import './Chat.css';

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const currentUser = getCurrentUser();
  const history = useHistory();

  useEffect(() => {
    loadConversation(); // eslint-disable-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setTimeout(() => contentRef.current?.scrollToBottom(200), 100);
  }, [messages]);

  function loadConversation() {
    if (!currentUser) return;
    const conv = getConversation(id);
    if (!conv) return;
    setConversation(conv);
    setMessages([...conv.messages]);

    const otherId = conv.participants.find((p) => p !== currentUser.id);
    if (otherId) {
      setOtherUser(getUserById(otherId) || null);
    }
  }

  function handleSendText(text: string) {
    if (!currentUser || !conversation) return;
    sendMessage({ conversationId: conversation.id, senderId: currentUser.id, content: text });
    loadConversation();
  }

  function handleImageSend(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !conversation) return;
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage({ conversationId: conversation.id, senderId: currentUser.id, content: 'Photo', type: 'image', imageUrl: reader.result as string });
      loadConversation();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  if (!currentUser || !otherUser) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton fill="clear" color="light" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonAvatar slot="start" style={{ width: '36px', height: '36px', margin: '0 8px' }}>
            <img src={otherUser.avatar} alt={otherUser.username} />
          </IonAvatar>
          <IonTitle>{otherUser.username}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} className="chat-content">
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>Dis bonjour à {otherUser.username} !</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMe={isMe}
                sender={isMe ? undefined : otherUser}
              />
            );
          })}
        </div>
      </IonContent>

      <ChatInputBar onSend={handleSendText} onImageSend={handleImageSend} />
    </IonPage>
  );
};

export default Chat;
