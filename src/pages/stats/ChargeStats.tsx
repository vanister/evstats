import React from 'react';
import EvsPage from '../../components/EvsPage';

interface ChargeStatsProps {}

export default function ChargeStats(props: ChargeStatsProps) {
  return (
    <EvsPage className="charge-stats" title="Charge Stats" color="light">
      Charge Stats
    </EvsPage>
  );
}
