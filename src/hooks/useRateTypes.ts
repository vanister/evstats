import { useEffect, useState } from 'react';
import { RateType } from '../models/rateType';
import { useServices } from '../providers/ServiceProvider';

export function useRateTypes() {
  const { rateService } = useServices();
  const [rateTypes, setRateTypes] = useState<RateType[]>([]);

  useEffect(() => {
    const loadRateTypes = async () => {
      const rates = await rateService.list();

      setRateTypes(rates);
    };

    loadRateTypes();
  }, []);

  return { rateTypes };
}
