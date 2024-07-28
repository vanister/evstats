import { useEffect } from 'react';
import { useRootSelector } from '../../hooks/useRootSelector';
import { render, screen, waitFor } from '@testing-library/react';
import { RootStateProvider } from './RootStateProvider';
import { useServices } from '../ServiceProvider';
import { Mock } from 'vitest';
import { MOCK_VEHICLES } from '../../__mocks__/vehicleData';
import { MOCK_RATE_TYPES } from '../../__mocks__/rateData';
import { useRootDispatch } from '../../hooks/useRootDispatch';
import {
  ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
  ROOT_SET_LAST_SELECTED_VEHICLE_ID
} from './actionTypes';

vi.mock('../ServiceProvider', () => ({
  useServices: vi.fn()
}));

// todo - fix vitest unhandled promise rejection error
describe.skip('RootStateProvider', () => {
  const mockVehicleService = { list: vi.fn().mockResolvedValue(MOCK_VEHICLES) };
  const mockRateService = { list: vi.fn().mockResolvedValue(MOCK_RATE_TYPES) };
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

    await waitFor(() => expect(screen.getByText('Loaded!')).toBeInTheDocument(), { timeout: 5000 });

    expect(mockRateService.list).toHaveBeenCalled();
    expect(mockVehicleService.list).toHaveBeenCalled();
  });

  describe('WHEN handling state changes', () => {
    const Dispatching = ({ type }: { type: 'rate' | 'vehicle' }) => {
      const dispatch = useRootDispatch();
      const lastSelectedVehicleId = useRootSelector((s) => s.lastSelectedVehicleId);
      const lastSelectedRateTypeId = useRootSelector((s) => s.lastSelectedRateTypeId);

      useEffect(() => {
        switch (type) {
          case 'rate':
            dispatch({
              type: ROOT_SET_LAST_SELECTED_RATE_TYPE_ID,
              payload: { lastSelectedRateTypeId: 42 }
            });
            break;

          case 'vehicle':
            dispatch({
              type: ROOT_SET_LAST_SELECTED_VEHICLE_ID,
              payload: { lastSelectedVehicleId: 142 }
            });
            break;

          default:
            throw new Error('invalid type');
        }
      }, [type]);

      return (
        <div>
          <p>Rate Type Id: {lastSelectedRateTypeId}</p>
          <p>Vehicle Id: {lastSelectedVehicleId}</p>
        </div>
      );
    };

    test('should allow dispatching last rate type changes', async () => {
      render(
        <RootStateProvider>
          <Dispatching type="rate" />
        </RootStateProvider>
      );

      await waitFor(() => screen.getByText(`Rate Type Id: 42`));
    });

    test('should allow dispatching last selected vehicle changes', async () => {
      render(
        <RootStateProvider>
          <Dispatching type="vehicle" />
        </RootStateProvider>
      );

      await waitFor(() => screen.getByText(`Vehicle Id: 142`));
    });
  });
});
