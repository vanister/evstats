import { render, screen, waitFor } from '@testing-library/react';
import { RootStateProvider } from './RootStateProvider';
import { useRootSelector } from '../../hooks/useRootSelector';
import { RootState } from './root-state-types';
import { useRootDispatch } from '../../hooks/useRootDispatch';
import { VehicleService } from '../../services/VehicleService';
import { VEHICLES } from '../../__mocks__/vehicleData';
import { useEffect } from 'react';
import { loadVehicles } from './actions';

describe('RootStateProvider', () => {
  test('should render the child inside of the provider', () => {
    const { baseElement } = render(
      <RootStateProvider>
        <p>Rendered</p>
      </RootStateProvider>
    );

    expect(baseElement).toBeDefined();
    expect(screen.getByText('Rendered')).toBeInTheDocument();
  });

  test('should provide state and dispatch to children', () => {
    const HasStateAndDispatch = () => {
      const state = useRootSelector((state) => state) as RootState;
      const dispatch = useRootDispatch();

      if (!state) {
        throw new Error('state is undefined');
      }

      if (!dispatch) {
        throw new Error('dispatch is undefined');
      }

      return <p>Both state and dispatch are defined!</p>;
    };

    const { baseElement } = render(
      <RootStateProvider>
        <HasStateAndDispatch />
      </RootStateProvider>
    );

    expect(baseElement).toBeDefined();
    expect(screen.getByText('Both state and dispatch are defined!'));
  });

  test('should have the initial state set', () => {
    const InitialState = () => {
      const state = useRootSelector((s) => s) as RootState;

      if (state.initialized) {
        throw new Error('state.initialized should be false');
      }

      if (state.vehicles.length > 0) {
        throw new Error('state.vehicles should be empty');
      }

      if (state.rateTypes.length > 0) {
        throw new Error('state.rateTypes should be empty');
      }

      if (state.lastSelectedRateTypeId) {
        throw new Error('state.lastSelectedRateTypeId is defined');
      }

      if (state.lastSelectedVehicleId) {
        throw new Error('state.lastSelectedVehicleId is defined');
      }

      return <p>Initial state is correct!</p>;
    };

    render(
      <RootStateProvider>
        <InitialState />
      </RootStateProvider>
    );

    screen.getByText('Initial state is correct!');
  });

  describe('WHEN loading vehicles', () => {
    const vehiclesLength = VEHICLES.length;
    const mockList = vi.fn();
    const mockVehicleService: Partial<VehicleService> = {
      list: mockList
    };

    const Vehicles = () => {
      const vehicles = useRootSelector((s) => s.vehicles);
      const error = useRootSelector((s) => s.error);
      const dispatch = useRootDispatch();

      useEffect(() => {
        const init = async () => {
          await loadVehicles(mockVehicleService as VehicleService, dispatch);
        };

        init();
      }, []);

      if (error) {
        return <p>Error loading vehicles.</p>;
      }

      if (vehicles.length === 0) {
        return <p>Loading...</p>;
      }

      return <p>{`${vehiclesLength} Vehicles loaded!`}</p>;
    };

    beforeEach(() => {
      mockList.mockClear();
    });

    test('should get a list of vehicles', async () => {
      mockList.mockResolvedValueOnce([...VEHICLES]);

      render(
        <RootStateProvider>
          <Vehicles />
        </RootStateProvider>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(`${vehiclesLength} Vehicles loaded!`)).toBeInTheDocument();
      });
    });

    describe('AND there is an error', () => {
      test('should show an error message', async () => {
        mockList.mockRejectedValueOnce(new Error('unit test failed'));

        render(
          <RootStateProvider>
            <Vehicles />
          </RootStateProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText('Error loading vehicles.')).toBeInTheDocument();
        });
      });
    });
  });
});
