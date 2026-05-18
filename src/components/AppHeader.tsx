import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router-dom";

interface Props {
  title?: string;
  showBack?: boolean;
}

const AppHeader: React.FC<Props> = ({ title, showBack = false }) => {
  const history = useHistory();

  return (
    <IonHeader>
      <IonToolbar color="primary">
        {showBack && (
          <IonButtons slot="start">
            <IonButton fill="clear" color="light" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        )}
        <IonTitle>
          <span className="toolbar-logo">{title ?? "Snapshoot"}</span>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
