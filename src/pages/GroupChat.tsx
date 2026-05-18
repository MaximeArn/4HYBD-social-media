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
  IonAlert,
  IonActionSheet,
} from '@ionic/react';
import { send, imageOutline, ellipsisVertical, exitOutline, informationCircleOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import {
  getCurrentUser,
  getGroup,
  sendGroupMessage,
  getUserById,
  leaveGroup,
  formatTime,
  type Message,
  type Group,
} from '../services/fakeApi';
import './Chat.css';
import './GroupChat.css';

const GroupChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
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

  function handleSend() {
    if (!inputText.trim() || !currentUser || !group) return;
    sendGroupMessage(group.id, currentUser.id, inputText.trim());
    setInputText('');
    loadGroup();
  }

  function handleImageSend(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !group) return;
    const reader = new FileReader();
    reader.onload = () => {
      sendGroupMessage(group.id, currentUser.id, 'Photo', 'image', reader.result as string);
      loadGroup();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleLeaveGroup() {
    if (!currentUser || !group) return;
    leaveGroup(group.id, currentUser.id);
    history.replace('/tabs/messages');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSend();
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
              <div key={msg.id} className={`message-bubble-wrapper ${isMe ? 'me' : 'them'}`}>
                {!isMe && sender && (
                  <IonAvatar className="bubble-avatar">
                    <img src={sender.avatar} alt={sender.username} />
                  </IonAvatar>
                )}
                <div>
                  {!isMe && sender && (
                    <p className="sender-name">{sender.username}</p>
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
          <IonButton fill="clear" onClick={handleSend} disabled={!inputText.trim()} className="send-btn">
            <IonIcon icon={send} color="primary" />
          </IonButton>
        </div>
      </IonFooter>

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
