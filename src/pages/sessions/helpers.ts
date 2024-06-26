import { RateType } from '../../models/rateType';
import { Session, SessionViewModal } from '../../models/session';
import { Vehicle } from '../../models/vehicle';

export function createSessionVm(
  session: Session,
  vehicles: Vehicle[],
  rateTypes: RateType[]
): SessionViewModal {
  const { id = -1, date, kWhAdded } = session;
  const rateType = rateTypes.find((r) => r.id === session.rateTypeId)?.name ?? 'Rate not found';
  const vehicleName =
    vehicles.find((v) => v.id === session.vehicleId)?.model ?? 'Vehicle not found ';

  const vm: SessionViewModal = { id, date, kWh: kWhAdded, vehicleName, rateType };

  return vm;
}
