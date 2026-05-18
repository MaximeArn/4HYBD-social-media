import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { register } from '../services/fakeApi';
import './auth.css';

const VILLES = [
  'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse',
  'Lille', 'Nantes', 'Strasbourg', 'Nice', 'Montpellier',
];

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('Paris');
  const [error, setError] = useState('');
  const history = useHistory();

  function handleRegister() {
    setError('');
    if (!username || !email || !password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    const result = register({ email, password, username, bio, city });
    if (result.error) {
      setError(result.error);
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
              <h1>Créer un compte</h1>
              <p>Rejoins la communauté Snapshoot</p>
            </div>

            <div className="auth-fields">
              <input
                className="auth-input"
                placeholder="Nom d'utilisateur *"
                value={username}
                maxLength={30}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="auth-input"
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="auth-input"
                type="password"
                placeholder="Mot de passe *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="auth-input"
                type="password"
                placeholder="Confirmer le mot de passe *"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <select
                className="auth-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {VILLES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <textarea
                className="auth-textarea"
                placeholder="Bio (optionnel)"
                value={bio}
                maxLength={150}
                rows={2}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {error && (
              <IonText color="danger">
                <p className="auth-error">{error}</p>
              </IonText>
            )}

            <IonButton expand="block" onClick={handleRegister} className="auth-submit">
              Créer mon compte
            </IonButton>

            <div className="auth-footer">
              <span>Déjà un compte ?</span>
              <IonButton fill="clear" size="small" routerLink="/login">
                Se connecter
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
