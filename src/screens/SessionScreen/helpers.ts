import { RateType } from '../../models/rateType';
import { Session, SessionLog } from '../../models/session';
import { Vehicle } from '../../models/vehicle';
import {
  setLastUsedRateTypeId,
  setLastUsedVehicleId
} from '../../providers/RootStateProvider/actions';
import { RootDispatch } from '../../providers/RootStateProvider/root-state-types';

export function toSessionLogItem(
  session: Session,
  vehicles: Vehicle[],
  rateTypes: RateType[]
): SessionLog {
  const { id = -1, date, kWhAdded } = session;
  const rateType = rateTypes.find((r) => r.id === session.rateTypeId)?.name ?? 'Rate not found';
  const vehicleName =
    vehicles.find((v) => v.id === session.vehicleId)?.model ?? 'Vehicle not found ';

  const vm: SessionLog = {
    id,
    date,
    kWh: kWhAdded,
    rateType,
    rateTypeId: session.rateTypeId,
    vehicleName,
    vehicleId: session.vehicleId
  };

  return vm;
}

export async function updateLastUsedRateAndVehicle(
  session: Session,
  dispatch: RootDispatch
): Promise<void> {
  const { rateTypeId, vehicleId } = session;

  await setLastUsedRateTypeId(rateTypeId, dispatch);
  await setLastUsedVehicleId(vehicleId, dispatch);
}
