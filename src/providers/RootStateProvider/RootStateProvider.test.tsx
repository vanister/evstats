import { useEffect } from 'react';
import { useRootSelector } from '../../hooks/useRootSelector';
import { render, screen, waitFor } from '@testing-library/react';
import { RootStateProvider } from './RootStateProvider';
import { useServices } from '../ServiceProvider';
import { Mock } from 'vitest';
import { MOCK_VEHICLES } from '../../__mocks__/vehicleData';
import { MOCK_RATE_TYPES } from '../../__mocks__/rateData';

vi.mock('../ServiceProvider', () => ({
  useServices: vi.fn()
}));

describe('RootStateProvider', () => {
  const mockVehicleService = { list: vi.fn().mockResolvedValue(MOCK_VEHICLES) };
  const mockRateService = { list: vi.fn().mockResolvedValueOnce(MOCK_RATE_TYPES) };
  const mockUseServices = useServices as Mock;

  const TestComponent = () => {
    const rootState = useRootSelector((s) => s);

    useEffect(() => {
      if (!rootState.initialized) {
        return;
      }

      if (rootState.rateTypes.length === 0) {
        throw new Error('No vehicles loaded');
      }

      if (rootState.rateTypes.length === 0) {
        throw new Error('No vehicles loaded');
      }
    }, [rootState]);

    if (!rootState.initialized) {
      return <div>Loading...</div>;
    }

    return <div>Loaded!</div>;
  };

  beforeAll(() => {
    mockUseServices.mockReturnValue({
      vehicleService: mockVehicleService,
      rateService: mockRateService
    });
  });

  test('should load vehicles and rate types', async () => {
    render(
      <RootStateProvider>
        <TestComponent />
      </RootStateProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Loaded!')).toBeInTheDocument());
  });
});
