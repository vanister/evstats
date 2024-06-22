import './Home.css';

import ExploreContainer from '../components/ExploreContainer';
import EvsPage from '../components/EvsPage';

const Home: React.FC = () => {
  return (
    <EvsPage title="Home">
      <ExploreContainer />
    </EvsPage>
  );
};

export default Home;
