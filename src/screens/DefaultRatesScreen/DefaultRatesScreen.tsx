import { useIonViewWillEnter, IonList, IonItem, IonLabel, IonNote, useIonAlert } from '@ionic/react';
import { useState, useRef } from 'react';
import EvsPage from '../../components/EvsPage';
import { RateType } from '../../models/rateType';
import { useAppSelector } from '../../redux/hooks';
import { useServices } from '../../providers/ServiceProvider';
import RateModal from './components/RateModal/RateModal';
import { useAppDispatch } from '../../redux/hooks';
import { setRateTypes } from '../../redux/rateTypeSlice';
import { ChargeColors } from '../../constants';

export default function DefaultRatesScreen() {
  const pageRef = useRef<HTMLElement>(null);
  const rateService = useServices('rateService');
  const dispatch = useAppDispatch();
  const rateTypes = useAppSelector((s) => s.rateType.rateTypes);
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<RateType>(null);
  const [showAlert] = useIonAlert();

  useIonViewWillEnter(() => {
    // Rate types are loaded globally, no need to reload here
  });


  const handleEditRateClick = (rateType: RateType) => {
    setShowModal(true);
    setEditingRate(rateType);
  };

  const handleSaveClick = async (rate: RateType): Promise<boolean> => {
    try {
      await rateService.update(rate);

      // Reload rate types to refresh the list
      const updatedRates = await rateService.list();
      dispatch(setRateTypes(updatedRates));
      
      return true;
    } catch (error) {
      await showAlert(`Failed to update rate: ${error.message}`, [
        { text: 'OK', role: 'cancel' }
      ]);
      return false;
    }
  };

  const handleModalDismiss = () => {
    setShowModal(false);
    setEditingRate(null);
  };


  return (
    <EvsPage
      ref={pageRef}
      className="default-rates-screen"
      title="Default Rates"
    >
      <IonList inset>
        {rateTypes.map((rateType) => (
          <IonItem key={rateType.id} button onClick={() => handleEditRateClick(rateType)}>
            <div slot="start" style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: rateType.color || ChargeColors.Home,
              border: '2px solid #ccc'
            }} />
            <IonLabel>
              <h2>{rateType.name}</h2>
            </IonLabel>
            <IonNote slot="end">{rateType.amount.toFixed(2)}/{rateType.unit}</IonNote>
          </IonItem>
        ))}
      </IonList>

      {showModal && (
        <RateModal
          isNew={false}
          presentingElement={pageRef.current}
          rate={editingRate}
          onSave={handleSaveClick}
          onDidDismiss={handleModalDismiss}
        />
      )}
    </EvsPage>
  );
}