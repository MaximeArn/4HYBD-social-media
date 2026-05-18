import { useState } from 'react';
import { IonFooter, IonInput, IonButton, IonIcon } from '@ionic/react';
import { send, imageOutline } from 'ionicons/icons';

interface Props {
  onSend: (text: string) => void;
  onImageSend: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatInputBar: React.FC<Props> = ({ onSend, onImageSend }) => {
  const [inputText, setInputText] = useState('');

  function handleSend() {
    if (!inputText.trim()) return;
    onSend(inputText.trim());
    setInputText('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <IonFooter className="chat-footer">
      <div className="chat-input-bar">
        <label className="image-send-btn">
          <IonIcon icon={imageOutline} />
          <input type="file" accept="image/*" onChange={onImageSend} style={{ display: 'none' }} />
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
  );
};

export default ChatInputBar;
