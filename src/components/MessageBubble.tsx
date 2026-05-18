import { IonAvatar, IonText } from '@ionic/react';
import { formatTime, type Message, type User } from '../services/fakeApi';

interface Props {
  message: Message;
  isMe: boolean;
  sender?: User;
  showSenderName?: boolean;
}

const MessageBubble: React.FC<Props> = ({ message, isMe, sender, showSenderName = false }) => {
  return (
    <div className={`message-bubble-wrapper ${isMe ? 'me' : 'them'}`}>
      {!isMe && sender && (
        <IonAvatar className="bubble-avatar">
          <img src={sender.avatar} alt={sender.username} />
        </IonAvatar>
      )}
      <div>
        {!isMe && sender && showSenderName && (
          <p className="sender-name">{sender.username}</p>
        )}
        <div className={`message-bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
          {message.type === 'image' && message.imageUrl ? (
            <img src={message.imageUrl} alt="photo" className="message-image" />
          ) : (
            <p>{message.content}</p>
          )}
          <IonText color="medium">
            <span className="message-time-small">{formatTime(message.timestamp)}</span>
          </IonText>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
