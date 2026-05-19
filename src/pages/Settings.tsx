import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAlert,
  IonToggle,
} from '@ionic/react';
import {
  logOutOutline,
  trashOutline,
  chevronForwardOutline,
  moonOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCurrentUser, logout, deleteUser } from '../services/fakeApi';
import { isDarkMode, setDarkMode } from '../theme/theme';
import AppHeader from '../components/AppHeader';
import './Settings.css';

const Settings: React.FC = () => {
  const [darkMode, setDarkModeState] = useState(isDarkMode());
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();
  const currentUser = getCurrentUser();

  function handleThemeToggle(checked: boolean) {
    setDarkModeState(checked);
    setDarkMode(checked);
  }

  function handleLogout() {
    logout();
    history.replace('/login');
  }

  function handleDelete() {
    if (!currentUser) return;
    deleteUser(currentUser.id);
    history.replace('/login');
  }

  return (
    <IonPage>
      <AppHeader title="Paramètres" showBack />

      <IonContent>

        {/* Apparence */}
        <div className="settings-section">
          <p className="settings-section-title">Apparence</p>
          <IonList className="settings-list">
            <IonItem lines="none">
              <IonIcon icon={moonOutline} slot="start" className="settings-icon" />
              <IonLabel>Mode sombre</IonLabel>
              <IonToggle
                checked={darkMode}
                onIonChange={(e) => handleThemeToggle(e.detail.checked)}
              />
            </IonItem>
          </IonList>
        </div>

        {/* Compte */}
        <div className="settings-section">
          <p className="settings-section-title">Compte</p>
          <IonList className="settings-list">
            <IonItem button onClick={() => setShowLogoutAlert(true)} lines="full">
              <IonIcon icon={logOutOutline} slot="start" className="settings-icon" />
              <IonLabel>Se déconnecter</IonLabel>
              <IonIcon icon={chevronForwardOutline} slot="end" className="settings-chevron" />
            </IonItem>
            <IonItem button onClick={() => setShowDeleteAlert(true)} lines="none">
              <IonIcon icon={trashOutline} slot="start" color="danger" className="settings-icon" />
              <IonLabel color="danger">Supprimer mon compte</IonLabel>
              <IonIcon icon={chevronForwardOutline} slot="end" className="settings-chevron" />
            </IonItem>
          </IonList>
        </div>

        {/* À propos */}
        <div className="settings-section">
          <p className="settings-section-title">À propos</p>
          <IonList className="settings-list">
            <IonItem lines="full">
              <IonIcon icon={informationCircleOutline} slot="start" className="settings-icon" />
              <IonLabel>Application</IonLabel>
              <span className="settings-value">BeUnreal</span>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={informationCircleOutline} slot="start" className="settings-icon" style={{ opacity: 0 }} />
              <IonLabel>Version</IonLabel>
              <span className="settings-value">1.0.0</span>
            </IonItem>
          </IonList>
        </div>

      </IonContent>

      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header="Se déconnecter"
        message="Tu vas être déconnecté(e). À bientôt !"
        buttons={[
          { text: 'Annuler', role: 'cancel' },
          { text: 'Se déconnecter', handler: handleLogout },
        ]}
      />

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Supprimer le compte"
        message="Cette action est irréversible. Ton compte sera définitivement supprimé."
        buttons={[
          { text: 'Annuler', role: 'cancel' },
          { text: 'Supprimer', role: 'destructive', handler: handleDelete },
        ]}
      />
    </IonPage>
  );
};

export default Settings;
