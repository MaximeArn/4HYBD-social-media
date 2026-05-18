import { IonItem, IonAvatar, IonLabel, IonNote } from '@ionic/react';
import { formatTime, type Conversation, type Message, type User } from '../services/fakeApi';

type ConversationWithMeta = Conversation & { otherUser: User; lastMessage?: Message };

interface Props {
  conversation: ConversationWithMeta;
  onClick: () => void;
}

const ConversationItem: React.FC<Props> = ({ conversation, onClick }) => {
  const { otherUser, lastMessage } = conversation;

  return (
    <IonItem button onClick={onClick} detail>
      <IonAvatar slot="start">
        <img src={otherUser.avatar} alt={otherUser.username} />
      </IonAvatar>
      <IonLabel>
        <h2>{otherUser.username}</h2>
        {lastMessage && (
          <p>{lastMessage.type === 'image' ? 'Photo' : lastMessage.content}</p>
        )}
      </IonLabel>
      {lastMessage && (
        <IonNote slot="end" className="message-time">
          {formatTime(lastMessage.timestamp)}
        </IonNote>
      )}
    </IonItem>
  );
};

export default ConversationItem;
