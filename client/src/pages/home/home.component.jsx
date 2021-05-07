import { Redirect } from 'react-router-dom';

import ROUTE_PATHS from '../../router/route-paths';

const HomePage = () => <Redirect to={ROUTE_PATHS.DASHBOARD} />;

export default HomePage;
