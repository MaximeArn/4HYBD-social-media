import { IonItem, IonLabel, IonNote, IonIcon } from '@ionic/react';
import { peopleOutline } from 'ionicons/icons';
import { formatTime, type Group, type Message } from '../services/fakeApi';

type GroupWithMeta = Group & { lastMessage?: Message };

interface Props {
  group: GroupWithMeta;
  onClick: () => void;
}

const GroupItem: React.FC<Props> = ({ group, onClick }) => {
  const { lastMessage } = group;

  return (
    <IonItem button onClick={onClick} detail>
      <div slot="start" className="group-icon">
        <IonIcon icon={peopleOutline} />
      </div>
      <IonLabel>
        <h2>{group.name}</h2>
        <p>
          {lastMessage
            ? lastMessage.type === 'image' ? 'Photo' : lastMessage.content
            : group.description || `${group.members.length} membres`}
        </p>
      </IonLabel>
      {lastMessage && (
        <IonNote slot="end" className="message-time">
          {formatTime(lastMessage.timestamp)}
        </IonNote>
      )}
    </IonItem>
  );
};

export default GroupItem;
