import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonText,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { register } from '../services/fakeApi';

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
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Créer un compte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '16px 0' }}>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Nom d'utilisateur *</IonLabel>
              <IonInput
                value={username}
                onIonInput={(e) => setUsername(e.detail.value!)}
                maxlength={30}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Email *</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Mot de passe *</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Confirmer le mot de passe *</IonLabel>
              <IonInput
                type="password"
                value={confirm}
                onIonInput={(e) => setConfirm(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Ville</IonLabel>
              <IonSelect value={city} onIonChange={(e) => setCity(e.detail.value)}>
                {VILLES.map((v) => (
                  <IonSelectOption key={v} value={v}>
                    {v}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Bio (optionnel)</IonLabel>
              <IonTextarea
                value={bio}
                onIonInput={(e) => setBio(e.detail.value!)}
                rows={2}
                maxlength={150}
              />
            </IonItem>
          </IonList>

          {error && (
            <IonText color="danger">
              <p style={{ textAlign: 'center', padding: '8px' }}>{error}</p>
            </IonText>
          )}

          <div style={{ padding: '16px' }}>
            <IonButton expand="block" onClick={handleRegister}>
              Créer mon compte
            </IonButton>
            <IonButton expand="block" fill="clear" routerLink="/login">
              Déjà un compte ? Se connecter
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
