import { SessionRepository } from '../data/repositories/SessionRepository';
import { NotFoundError } from '../errors/NotFoundError';
import { Session, SessionDbo } from '../models/session';
import { BaseService } from './BaseService';
import { PartialPropertyRecord } from './service-types';

export interface SessionService {
  list(limit?: number, page?: number): Promise<Session[]>;
  get(id: number): Promise<Session>;
  add(session: Session): Promise<Session>;
  update(session: Session): Promise<void>;
  remove(id: number): Promise<void>;
}

export class EvsSessionService extends BaseService implements SessionService {
  private readonly sessionToDboPropMap: PartialPropertyRecord<Session, SessionDbo> = {
    kWh: 'kwh',
    rateOverride: 'rate_override',
    rateTypeId: 'rate_type_id',
    vehicleId: 'vehicle_id'
  };

  private readonly dboToSessionPopMap: PartialPropertyRecord<SessionDbo, Session> = {
    kwh: 'kWh',
    rate_override: 'rateOverride',
    rate_type_id: 'rateTypeId',
    vehicle_id: 'vehicleId'
  };

  constructor(private sessionRepository: SessionRepository) {
    super();
  }

  async list(limit = 20, page = 1): Promise<Session[]> {
    const dbos = await this.sessionRepository.list(limit, page);
    const sessions = dbos.map<Session>((dbo) => this.mapFrom(dbo, this.dboToSessionPopMap));

    return sessions;
  }

  async get(id: number): Promise<Session> {
    const dbo = await this.sessionRepository.get(id);

    if (!dbo) {
      throw new NotFoundError();
    }

    const session: Session = this.mapFrom(dbo, this.dboToSessionPopMap);

    return session;
  }

  async add(session: Session): Promise<Session> {
    const dbo: SessionDbo = this.mapFrom(session, this.sessionToDboPropMap);
    const newSession = await this.sessionRepository.add(dbo);

    return { ...session, id: newSession.id };
  }

  async update(session: Session): Promise<void> {
    const dbo: SessionDbo = this.mapFrom(session, this.sessionToDboPropMap);

    await this.sessionRepository.update(dbo);
  }

  async remove(id: number): Promise<void> {
    await this.sessionRepository.remove(id);
  }
}
