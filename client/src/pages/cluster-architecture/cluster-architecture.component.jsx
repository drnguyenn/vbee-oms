import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { fetchClusterDiagramStart } from '../../redux/diagram/diagram.actions';

import BasePage from '../base/base.component';
import Spinner from '../../components/spinner/spinner.component';
import ClusterArchitectureDiagram from '../../components/cluster-architecture-diagram/cluster-architecture-diagram.component';
import DiagramToolbar from '../../components/diagram/diagram-toolbar/diagram-toolbar.component';
import SyncIndicator from '../../components/sync-indicator/sync-indicator.component';
import Drawer from '../../components/drawer/drawer.component';

import ROUTE_PATHS from '../../router/route-paths';

const ClusterArchitecturePage = () => {
  const { id } = useParams();

  const { currentDiagram, isFetchingDiagram, isSynchronizing, error } =
    useSelector(state => state.diagram);

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClusterDiagramStart(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error)
      if (error.message === 'Cluster diagram not found')
        history.push(ROUTE_PATHS.NOT_FOUND);
  }, [error, history]);

  const handleHeaderButtonClick = () =>
    history.push(`${ROUTE_PATHS.CLUSTERS}/${id}`);

  if (isFetchingDiagram) return <Spinner />;

  if (currentDiagram)
    return (
      <BasePage
        title={
          currentDiagram.cluster &&
          `${currentDiagram.cluster.name} Architecture`
        }
        showHeaderButton
        tooltipTitle={
          currentDiagram.cluster &&
          `Back to "${currentDiagram.cluster.name}" Cluster Page`
        }
        headerButtonOnClick={handleHeaderButtonClick}
      >
        <ClusterArchitectureDiagram />
        <DiagramToolbar />
        <SyncIndicator spin={isSynchronizing} />
        <Drawer />
      </BasePage>
    );

  return null;
};

export default ClusterArchitecturePage;
