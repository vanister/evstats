import { NotFoundError } from '../errors/NotFoundError';
import { RateType } from '../models/rateType';
import { RateRepository } from '../repositories/RateRepository';
import { BaseService } from './BaseService';

export interface RateService {
  list(cache?: boolean): Promise<RateType[]>;
  get(id: number): Promise<RateType>;
}

export class EvsRateService extends BaseService implements RateService {
  constructor(private rateRepository: RateRepository) {
    super();
  }

  async list(_cache = true): Promise<RateType[]> {
    return this.rateRepository.list();
  }

  async get(id: number): Promise<RateType> {
    const rate = this.rateRepository.get(id);

    if (!rate) {
      throw new NotFoundError();
    }

    return rate;
  }
}
