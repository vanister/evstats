import { Redirect } from 'react-router';
import { useAppSelector } from './redux/hooks';

export default function MainRouteRedirect() {
  const hasVehicles = useAppSelector((s) => s.vehicles.length > 0);

  if (hasVehicles) {
    return <Redirect to="/sessions" />;
  }

  return <Redirect to="/vehicles" />;
}
