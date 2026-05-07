import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonList,
  IonNote,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { login } from '../services/fakeApi';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  function handleLogin() {
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    const user = login(email, password);
    if (!user) {
      setError('Email ou mot de passe incorrect.');
      return;
    }
    history.replace('/tabs/home');
  }

  function loginAsDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword('password123');
  }

  return (
    <IonPage>
      <IonContent className="login-content">
        <div className="login-container">
          <div className="login-logo">
            <h1>📸 Snapshoot</h1>
            <p>Capture & partage tes moments</p>
          </div>

          <IonList className="login-form">
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Mot de passe</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>
          </IonList>

          {error && (
            <IonText color="danger">
              <p className="login-error">{error}</p>
            </IonText>
          )}

          <IonButton expand="block" onClick={handleLogin} className="login-btn">
            Se connecter
          </IonButton>

          <IonButton expand="block" fill="outline" routerLink="/register" className="login-btn">
            Créer un compte
          </IonButton>

          <div className="demo-section">
            <IonNote>Comptes de démo (mot de passe : password123)</IonNote>
            <div className="demo-accounts">
              <IonButton size="small" fill="clear" onClick={() => loginAsDemo('marie@snapshoot.com')}>
                Marie (Paris)
              </IonButton>
              <IonButton size="small" fill="clear" onClick={() => loginAsDemo('thomas@snapshoot.com')}>
                Thomas (Lyon)
              </IonButton>
              <IonButton size="small" fill="clear" onClick={() => loginAsDemo('sophie@snapshoot.com')}>
                Sophie (Marseille)
              </IonButton>
              <IonButton size="small" fill="clear" onClick={() => loginAsDemo('lucas@snapshoot.com')}>
                Lucas (Bordeaux)
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
