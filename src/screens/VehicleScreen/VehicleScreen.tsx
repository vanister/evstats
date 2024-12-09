import './VehicleScreen.scss';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon
} from '@ionic/react';
import EvsFloatingActionButton from '../../components/EvsFloatingActionButton';
import { add } from 'ionicons/icons';
import EvsPage from '../../components/EvsPage';

export default function VehiclePage() {
  // const [isOpen, setIsOpen] = useState(true);
  // const [hasVehicles, setHasVehicles] = useState(false);
  // const history = useHistory();
  // const presentingElement = useRef<HTMLElement>();

  // const modalCanDismiss = async (_: unknown, _role: string) => {
  //   return false;
  // };

  // const handleModalDismiss = () => {
  //   history.replace('/sessions');
  // };

  const handleAddClick = () => {
    /* noop */
  };

  // const handleCloseClick = () => {
  //   setIsOpen(false);
  // };

  return (
    <EvsPage className="vehicle-page" color="light" title="Vehicles" fixedSlotPlacement="before">
      <EvsFloatingActionButton
        className="add-vehicle-fab"
        horizontal="end"
        vertical="bottom"
        onClick={handleAddClick}
        slot="fixed"
      >
        <IonIcon icon={add} />
      </EvsFloatingActionButton>
      {Array(10)
        .fill('card')
        .map((c, i) => (
          // todo - VehicleCard
          <IonCard key={`${c}-${i}`}>
            <IonCardHeader>
              <IonCardTitle>Card Title</IonCardTitle>
              <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              {"Here's a small text description for the card content. Nothing more, nothing less."}
            </IonCardContent>

            <IonButton fill="clear">Action 1</IonButton>
            <IonButton fill="clear">Action 2</IonButton>
          </IonCard>
        ))}
    </EvsPage>
  );
}
