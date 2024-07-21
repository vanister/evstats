import { RateType } from '../../models/rateType';
import { Session, SessionLog } from '../../models/session';
import { Vehicle } from '../../models/vehicle';

export function createSessionLogItem(
  session: Session,
  vehicles: Vehicle[],
  rateTypes: RateType[]
): SessionLog {
  const { id = -1, date, kWhAdded } = session;
  const rateType = rateTypes.find((r) => r.id === session.rateTypeId)?.name ?? 'Rate not found';
  const vehicleName =
    vehicles.find((v) => v.id === session.vehicleId)?.model ?? 'Vehicle not found ';

  const vm: SessionLog = { id, date, kWh: kWhAdded, vehicleName, rateType };

  return vm;
}
