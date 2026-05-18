import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { login } from '../services/fakeApi';
import './auth.css';

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
    const user = login({ email, password });
    if (!user) {
      setError('Email ou mot de passe incorrect.');
      return;
    }
    history.replace('/tabs/home');
  }

  return (
    <IonPage>
      <IonContent className="auth-content">
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-brand">
              <h1>Snapshoot</h1>
              <p>Capture & partage tes moments</p>
            </div>

            <div className="auth-fields">
              <input
                className="auth-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="auth-input"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && (
              <IonText color="danger">
                <p className="auth-error">{error}</p>
              </IonText>
            )}

            <IonButton expand="block" onClick={handleLogin} className="auth-submit">
              Se connecter
            </IonButton>

            <div className="auth-footer">
              <span>Pas encore de compte ?</span>
              <IonButton fill="clear" size="small" routerLink="/register">
                Créer un compte
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
