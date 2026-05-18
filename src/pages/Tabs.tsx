import { Redirect, Route } from 'react-router-dom';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { homeOutline, chatbubblesOutline, peopleOutline, personOutline } from 'ionicons/icons';
import Home from './Home';
import Messages from './Messages';
import Chat from './Chat';
import GroupChat from './GroupChat';
import NewGroup from './NewGroup';
import Friends from './Friends';
import Profile from './Profile';
import UserProfile from './UserProfile';
import Settings from './Settings';
import GroupSettings from './GroupSettings';
import EditGroup from './EditGroup';

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home" component={Home} />
        <Route exact path="/tabs/messages" component={Messages} />
        <Route exact path="/tabs/chat/:id" component={Chat} />
        <Route exact path="/tabs/group-chat/:id" component={GroupChat} />
        <Route exact path="/tabs/new-group" component={NewGroup} />
        <Route exact path="/tabs/friends" component={Friends} />
        <Route exact path="/tabs/user/:id" component={UserProfile} />
        <Route exact path="/tabs/profile" component={Profile} />
        <Route exact path="/tabs/settings" component={Settings} />
        <Route exact path="/tabs/group-settings/:id" component={GroupSettings} />
        <Route exact path="/tabs/edit-group/:id" component={EditGroup} />
        <Route exact path="/tabs">
          <Redirect to="/tabs/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Accueil</IonLabel>
        </IonTabButton>
        <IonTabButton tab="messages" href="/tabs/messages">
          <IonIcon icon={chatbubblesOutline} />
          <IonLabel>Messages</IonLabel>
        </IonTabButton>
        <IonTabButton tab="friends" href="/tabs/friends">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Amis</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Profil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
