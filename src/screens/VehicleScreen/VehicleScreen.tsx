import VehicleList from './components/VehicleList';
import { Route } from 'react-router';

export default function VehicleScreen() {
  return (
    <Route path="/vehicles">
      <Route path="/" component={VehicleList} />
    </Route>
  );
}
