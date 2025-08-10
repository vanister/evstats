import { RateRepository } from '../data/repositories/RateRepository';
import { NotFoundError } from '../errors/NotFoundError';
import { RateType, RateTypeDbo } from '../models/rateType';
import { BaseService } from './BaseService';
import { PartialPropertyRecord } from './service-types';

export interface RateService {
  list(cache?: boolean): Promise<RateType[]>;
  get(id: number): Promise<RateType>;
  update(rate: RateType): Promise<void>;
}

export class EvsRateService extends BaseService implements RateService {
  private readonly rateToDboPropMap: PartialPropertyRecord<RateType, RateTypeDbo> = {
    defaultColor: 'default_color'
  };

  private readonly dboToRatePropMap: PartialPropertyRecord<RateTypeDbo, RateType> = {
    default_color: 'defaultColor'
  };

  constructor(private rateRepository: RateRepository) {
    super();
  }

  async list(_cache = true): Promise<RateType[]> {
    const dbos = await this.rateRepository.list();
    return dbos.map(dbo => this.mapFrom(dbo, this.dboToRatePropMap) as RateType);
  }

  async get(id: number): Promise<RateType> {
    const dbo = await this.rateRepository.get(id);

    if (!dbo) {
      throw new NotFoundError();
    }

    return this.mapFrom(dbo, this.dboToRatePropMap) as RateType;
  }

  async update(rate: RateType): Promise<void> {
    const dbo = this.mapFrom(rate, this.rateToDboPropMap) as RateTypeDbo;
    return this.rateRepository.update(dbo);
  }
}
