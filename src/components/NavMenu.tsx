import './NavMenu.scss';

import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useMenuControl } from '../hooks/useMenuControl';

export type NavMenuProps = {
  contentId: string;
};

export default function NavMenu(props: NavMenuProps) {
  const { disabled } = useMenuControl();

  return (
    <IonMenu
      className="nav-menu"
      contentId={props.contentId}
      disabled={disabled}
      hidden={disabled}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle className="left-align">EV Stats</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="menu-content ion-padding disable-scroll">
        <IonList>
          <IonItem>
            <IonLabel>Pokémon Yellow</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Mega Man X</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>The Legend of Zelda</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Pac-Man</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Super Mario World</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
