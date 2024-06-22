import { useEffect } from 'react';
import EvsPage from '../../components/EvsPage';
import { useMenuControl } from '../../hooks/useMenuControl';

export default function VehicleSelection() {
  const { setDisabled } = useMenuControl();

  useEffect(() => {
    // this page doesn't have a menu
    setDisabled(true);

    return () => {
      // make sure we enable the menu again when the component unmounts
      setDisabled(false);
    };
  }, []);

  return (
    <EvsPage title="Vehicles" hideMenuButton>
      TODO
    </EvsPage>
  );
}
