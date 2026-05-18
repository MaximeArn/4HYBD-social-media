import { IonAvatar } from '@ionic/react';
import { formatTime, type Message, type User } from '../services/fakeApi';

interface Props {
  message: Message;
  isMe: boolean;
  sender?: User;
  me?: User;
  showSenderName?: boolean;
  onAvatarClick?: (userId: string) => void;
}

const MessageBubble: React.FC<Props> = ({ message, isMe, sender, me, showSenderName = false, onAvatarClick }) => {
  const avatarUser = isMe ? me : sender;

  return (
    <div className={`message-row ${isMe ? 'row-me' : 'row-them'}`}>
      {avatarUser && (
        <IonAvatar
          className="bubble-avatar"
          onClick={() => onAvatarClick?.(avatarUser.id)}
          style={onAvatarClick ? { cursor: 'pointer' } : undefined}
        >
          <img src={avatarUser.avatar} alt={avatarUser.username} />
        </IonAvatar>
      )}

      <div className="bubble-col">
        {!isMe && sender && showSenderName && (
          <p className="sender-name">{sender.username}</p>
        )}
        <div className={`message-bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
          {message.type === 'image' && message.imageUrl ? (
            <img src={message.imageUrl} alt="photo" className="message-image" />
          ) : (
            <p className="bubble-text">{message.content}</p>
          )}
          <div className="bubble-footer">
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
