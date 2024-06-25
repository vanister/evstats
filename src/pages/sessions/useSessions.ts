import { useEffect, useState } from 'react';
import { Session, SessionViewModal } from '../../models/session';
import { useVehicles } from '../../hooks/useVehicles';
import { useRateTypes } from '../../hooks/useRateTypes';

const MOCK_SESSIONS: Partial<Session>[] = [
  {
    id: 1,
    kWhAdded: 43,
    date: new Date(2024, 5, 22),
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 2,
    kWhAdded: 22,
    date: new Date(2024, 4, 16),
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 3,
    kWhAdded: 12,
    date: new Date(2024, 4, 8),
    rateTypeId: 3,
    vehicleId: 2
  }
];

export function useSessions() {
  const { vehicles } = useVehicles();
  const { rateTypes } = useRateTypes();
  const [sessionsEntries] = useState(MOCK_SESSIONS);
  const [sessions, setSessions] = useState<SessionViewModal[]>([]);

  useEffect(() => {
    const vms = sessionsEntries.map((s) => {
      const vehicleName = vehicles.find((v) => v.id === s.vehicleId)?.model ?? 'Vehicle not found ';
      const rateType = rateTypes.find((r) => r.id === s.rateTypeId)?.name ?? 'Rate not found';
      const vm = new SessionViewModal(s.id!, s.date!, s.kWhAdded!, vehicleName, rateType);

      return vm;
    });

    setSessions(vms);
  }, []);

  return { sessions };
}
