import React from 'react';
import EvsPage from '../../components/EvsPage';

interface ChargeStatsScreenProps {}

export default function ChargeStatsScreen(props: ChargeStatsScreenProps) {
  return (
    <EvsPage className="charge-stats" title="Charge Stats" color="light">
      Charge Stats
    </EvsPage>
  );
}
