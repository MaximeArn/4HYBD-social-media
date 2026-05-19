import { useState } from 'react';
import { IonFooter, IonInput, IonButton, IonIcon } from '@ionic/react';
import { send, imageOutline, cameraOutline } from 'ionicons/icons';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface Props {
  onSend: (text: string) => void;
  onImageSend: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraPhoto?: (dataUrl: string) => void;
}

const ChatInputBar: React.FC<Props> = ({ onSend, onImageSend, onCameraPhoto }) => {
  const [inputText, setInputText] = useState('');

  function handleSend() {
    if (!inputText.trim()) return;
    onSend(inputText.trim());
    setInputText('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSend();
  }

  async function handleCamera() {
    try {
      const photo = await Camera.takePhoto({ quality: 80 });
      if (!onCameraPhoto) return;
      if (photo.thumbnail) {
        onCameraPhoto(`data:image/jpeg;base64,${photo.thumbnail}`);
      } else if (photo.uri) {
        onCameraPhoto(photo.uri);
      }
    } catch {
      // user cancelled
    }
  }

  const isNative = Capacitor.isNativePlatform();

  return (
    <IonFooter className="chat-footer">
      <div className="chat-input-bar">
        {isNative ? (
          <IonButton fill="clear" className="image-send-btn" onClick={handleCamera}>
            <IonIcon icon={cameraOutline} />
          </IonButton>
        ) : (
          <label className="image-send-btn">
            <IonIcon icon={imageOutline} />
            <input type="file" accept="image/*" onChange={onImageSend} style={{ display: 'none' }} />
          </label>
        )}
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
