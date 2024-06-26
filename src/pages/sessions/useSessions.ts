import { useCallback, useEffect, useState } from 'react';
import { Session, SessionViewModal } from '../../models/session';
import { Vehicle, useVehicles } from '../../hooks/useVehicles';
import { RateType, useRateTypes } from '../../hooks/useRateTypes';

const MOCK_SESSIONS: Partial<Session>[] = [
  {
    id: 1,
    kWhAdded: 43,
    date: '2024-05-22',
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 2,
    kWhAdded: 22,
    date: '2024-04-16',
    rateTypeId: 1,
    vehicleId: 1
  },
  {
    id: 3,
    kWhAdded: 12,
    date: '2024-04-08',
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
      const vm = createSessionVm(s as Session, vehicles, rateTypes);

      return vm;
    });

    setSessions(vms);
  }, []);

  const addSession = useCallback(
    async (session: Session) => {
      const vm = createSessionVm(session, vehicles, rateTypes);
      vm.id = sessions.length + 1;

      setSessions((s) => [...s, vm]);
    },
    [sessions]
  );

  return { sessions, addSession };
}

// todo - move to helpers
function createSessionVm(s: Session, vehicles: Vehicle[], rateTypes: RateType[]): SessionViewModal {
  const vehicleName = vehicles.find((v) => v.id === s.vehicleId)?.model ?? 'Vehicle not found ';
  const rateType = rateTypes.find((r) => r.id === s.rateTypeId)?.name ?? 'Rate not found';
  const vm = new SessionViewModal(s.id!, s.date!, s.kWhAdded!, vehicleName, rateType);

  return vm;
}
