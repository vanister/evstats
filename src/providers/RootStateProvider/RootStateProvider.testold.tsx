import { render, screen, waitFor } from '@testing-library/react';
import { RootStateProvider } from './RootStateProvider';
import { RootStateSelect, useRootSelector } from '../../hooks/useRootSelector';
import { RootState } from './root-state-types';
import { useRootDispatch } from '../../hooks/useRootDispatch';
import { VehicleService } from '../../services/VehicleService';
import { VEHICLES } from '../../__mocks__/vehicleData';
import { useEffect } from 'react';
import { loadRateTypes, loadVehicles } from './actions';
import { RateService } from '../../services/RateService';
import { RATE_TYPES } from '../../__mocks__/rateData';

describe('RootStateProvider', () => {
  type TestComponentProps = {
    service: Partial<{ list: () => Promise<unknown> }>;
    selector: RootStateSelect<unknown>;
    type: 'rate' | 'vehicle';
  };

  const TestComponent = ({ service, selector, type }: TestComponentProps) => {
    const data = useRootSelector(selector) as unknown[];
    const error = useRootSelector((s) => s.error);
    const dispatch = useRootDispatch();

    useEffect(() => {
      const init = async () => {
        switch (type) {
          case 'vehicle':
            return await loadVehicles(service as VehicleService, dispatch);
          case 'rate':
            return await loadRateTypes(service as RateService, dispatch);
          default:
            throw new Error('Invalid type');
        }
      };

      init();
    }, []);

    if (error) {
      return <p>{`Error loading ${type}.`}</p>;
    }

    if (data.length === 0) {
      return <p>Loading...</p>;
    }

    return <p>Data loaded!</p>;
  };

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
    const mockList = vi.fn();
    const mockVehicleService: Partial<VehicleService> = {
      list: mockList
    };

    beforeEach(() => {
      mockList.mockClear();
    });

    test('should get a list of vehicles', async () => {
      mockList.mockResolvedValueOnce([...VEHICLES]);

      render(
        <RootStateProvider>
          <TestComponent service={mockVehicleService} selector={(s) => s.vehicles} type="vehicle" />
        </RootStateProvider>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Data loaded!')).toBeInTheDocument();
      });
    });

    describe('AND there is an error', () => {
      test('should show an error message', async () => {
        mockList.mockRejectedValueOnce(new Error('unit test failed'));

        render(
          <RootStateProvider>
            <TestComponent
              service={mockVehicleService}
              selector={(s) => s.vehicles}
              type="vehicle"
            />
          </RootStateProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText('Error loading vehicle.')).toBeInTheDocument();
        });
      });
    });
  });

  describe('WHEN loading rate types', () => {
    const mockList = vi.fn();
    const mockRateService: Partial<RateService> = {
      list: mockList
    };

    beforeEach(() => {
      mockList.mockClear();
    });

    test('should get a list of rate types', async () => {
      mockList.mockResolvedValueOnce(RATE_TYPES);

      render(
        <RootStateProvider>
          <TestComponent service={mockRateService} selector={(s) => s.rateTypes} type="rate" />
        </RootStateProvider>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Data loaded!')).toBeInTheDocument();
      });
    });
  });
});
