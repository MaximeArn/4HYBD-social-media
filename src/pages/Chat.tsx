import { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonIcon,
  IonAvatar,
  IonButtons,
  IonBackButton,
  IonText,
} from '@ionic/react';
import { send, imageOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import {
  getCurrentUser,
  getConversation,
  sendMessage,
  getUserById,
  formatTime,
  type Message,
  type User,
  type Conversation,
} from '../services/fakeApi';
import './Chat.css';

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const contentRef = useRef<HTMLIonContentElement>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadConversation(); // eslint-disable-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    scrollToBottom();
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

  function scrollToBottom() {
    setTimeout(() => {
      contentRef.current?.scrollToBottom(200);
    }, 100);
  }

  function handleSend() {
    if (!inputText.trim() || !currentUser || !conversation) return;
    sendMessage(conversation.id, currentUser.id, inputText.trim());
    setInputText('');
    loadConversation();
  }

  function handleImageSend(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !conversation) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      sendMessage(conversation.id, currentUser.id, 'Photo', 'image', base64);
      loadConversation();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSend();
  }

  if (!currentUser || !otherUser) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/messages" />
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
              <div key={msg.id} className={`message-bubble-wrapper ${isMe ? 'me' : 'them'}`}>
                {!isMe && (
                  <IonAvatar className="bubble-avatar">
                    <img src={otherUser.avatar} alt={otherUser.username} />
                  </IonAvatar>
                )}
                <div className={`message-bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
                  {msg.type === 'image' && msg.imageUrl ? (
                    <img src={msg.imageUrl} alt="photo" className="message-image" />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <IonText color="medium">
                    <span className="message-time-small">{formatTime(msg.timestamp)}</span>
                  </IonText>
                </div>
              </div>
            );
          })}
        </div>
      </IonContent>

      <IonFooter className="chat-footer">
        <div className="chat-input-bar">
          <label className="image-send-btn">
            <IonIcon icon={imageOutline} />
            <input type="file" accept="image/*" onChange={handleImageSend} style={{ display: 'none' }} />
          </label>
          <IonInput
            className="chat-input"
            value={inputText}
            onIonInput={(e) => setInputText(e.detail.value!)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
          />
          <IonButton
            fill="clear"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="send-btn"
          >
            <IonIcon icon={send} color="primary" />
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Chat;
