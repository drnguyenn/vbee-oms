import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import createEngine, { DiagramModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import {
  addClusterDiagramLinkStart,
  addClusterDiagramNodeStart,
  setShowDrawer
} from 'redux/diagram/diagram.actions';
import { fetchServersMetricsStart } from 'redux/server/server.actions';

import {
  debouncedUpdateDiagram,
  getDiagramChanges,
  setDiagramChanges
} from 'utils/diagram.utils';

import CustomDefaultState from 'components/diagram/custom-state/custom-default.state';

import CustomDeleteItemsAction from 'components/diagram/custom-action/custom-delete-items/custom-delete-items.action';
import CustomClearSelectionAction from 'components/diagram/custom-action/custom-clear-selection/custom-clear-selection.action';
import CustomZoomAction from 'components/diagram/custom-action/custom-zoom/custom-zoom.action';
import CustomMoveCanvasAction from 'components/diagram/custom-action/custom-move-canvas/custom-move-canvas.action';

import CustomNodeFactory from 'components/diagram/custom-node/custom-node.factory';
import CustomLinkFactory from 'components/diagram/custom-link/custom-link.factory';
import CustomNodeModel from 'components/diagram/custom-node/custom-node.model';
import CustomPortModel from 'components/diagram/custom-port/custom-port.model';
import CustomLinkModel from 'components/diagram/custom-link/custom-link.model';

import { ClusterArchitectureDiagramStyles } from './cluster-architecture-diagram.styles';

const actions = [
  CustomDeleteItemsAction,
  CustomClearSelectionAction,
  CustomZoomAction,
  CustomMoveCanvasAction
];

const engine = createEngine({
  registerDefaultDeleteItemsAction: false,
  registerDefaultZoomCanvasAction: false
});

engine.getNodeFactories().registerFactory(new CustomNodeFactory());
engine.getLinkFactories().registerFactory(new CustomLinkFactory());

engine.getStateMachine().pushState(new CustomDefaultState());

actions.forEach(Action =>
  engine.getActionEventBus().registerAction(new Action())
);

let model = new DiagramModel();

engine.setModel(model);

const ClusterArchitectureDiagram = () => {
  const { currentDiagram, showDrawer } = useSelector(state => state.diagram);

  const dispatch = useDispatch();

  const handleNodeEvent = useCallback(event => {
    if (
      event.entity instanceof CustomNodeModel &&
      event.function === 'positionChanged'
    ) {
      const { id, position, ports } = event.entity;

      const linkUpdates = Object.values(ports).reduce(
        (portAccumulator, { links }) => {
          const linkWithPoints = Object.values(links).reduce(
            (linkAccumulator, { id: linkId, points }) => ({
              ...linkAccumulator,
              [linkId]: {
                points: points.map(({ position: pointPosition }) => ({
                  position: pointPosition
                }))
              }
            }),
            {}
          );

          return { ...portAccumulator, ...linkWithPoints };
        },
        {}
      );

      const changes = getDiagramChanges();

      setDiagramChanges({
        ...changes,
        nodes: { ...changes.nodes, [id]: { position } },
        links: { ...changes.links, ...linkUpdates }
      });

      debouncedUpdateDiagram();
    }
  }, []);

  const handleLinkCreationEvent = useCallback(
    event => {
      if (event.entity instanceof CustomLinkModel) {
        const { sourcePort, targetPort } = event.entity;

        if (sourcePort && targetPort) {
          dispatch(
            addClusterDiagramLinkStart(
              {
                sourcePortId: sourcePort.options.id,
                targetPortId: targetPort.options.id,
                points: event.entity
                  .getPoints()

                  .map(point => ({ position: point.getPosition() })),
                diagramId: currentDiagram.id
              },
              // Remove this link to use link created from server
              () => event.entity.remove()
            )
          );
        }

        debouncedUpdateDiagram.flush();
      }
    },
    [currentDiagram.id, dispatch]
  );

  const handleLinkUpdateEvent = useCallback(event => {
    if (event.entity instanceof CustomLinkModel) {
      const { id, points } = event.entity;

      const changes = getDiagramChanges();

      setDiagramChanges({
        ...changes,
        links: {
          ...changes.links,
          [id]: { points: points.map(({ position }) => ({ position })) }
        }
      });

      debouncedUpdateDiagram();
    }
  }, []);

  useEffect(() => {
    model = new DiagramModel();

    engine.setModel(model);
  }, []);

  useEffect(() => {
    let allPorts = {};

    const nodes = currentDiagram.nodes.map(
      ({ id, name, ports, position: { x, y }, service }) => {
        const node = new CustomNodeModel({ id, name }, service);
        node.setPosition(x, y);

        if (ports)
          ports.forEach(({ id: portId, options }) => {
            const port = node.addPort(
              new CustomPortModel({
                id: portId,
                name: portId,
                in: options.in,
                alignment: options.alignment
              })
            );

            allPorts = { ...allPorts, [portId]: port };
          });

        node.registerListener({
          eventDidFire: handleNodeEvent
        });

        return node;
      }
    );

    const links = currentDiagram.links.map(
      ({ id, sourcePort, targetPort, points }) => {
        const link = new CustomLinkModel({ id });

        link.setSourcePort(allPorts[sourcePort]);
        link.setTargetPort(allPorts[targetPort]);

        link.setInitFirstPoint(points[0].position.x, points[0].position.y);
        link.setInitLastPoint(
          points[points.length - 1].position.x,
          points[points.length - 1].position.y
        );

        points
          .slice(1, -1)
          .forEach(({ position: { x, y } }) => link.point(x, y, -1));

        link.registerListener({
          linksUpdated: handleLinkUpdateEvent
        });

        return link;
      }
    );

    model.addAll(...nodes, ...links);

    engine.repaintCanvas();
  }, [currentDiagram, handleNodeEvent, handleLinkUpdateEvent]);

  useEffect(() => {
    model.registerListener({
      linksUpdated: event =>
        event.link.registerListener({
          targetPortChanged: handleLinkCreationEvent
        })
    });
  }, [handleLinkCreationEvent]);

  useEffect(() => {
    const serverIds = currentDiagram.nodes
      .filter(node => node.service && node.service.server)
      .map(node => node.service.server.id);

    if (serverIds.length) {
      const intervalId = setInterval(() => {
        dispatch(fetchServersMetricsStart(serverIds));
      }, 10000);

      return () => clearInterval(intervalId);
    }

    return () => {};
  }, [currentDiagram.nodes, dispatch]);

  useEffect(
    () => () => {
      if (showDrawer) dispatch(setShowDrawer(false));
    },
    [dispatch, showDrawer]
  );

  const handleDrop = event => {
    const { x, y } = engine.getRelativeMousePoint(event);

    dispatch(
      addClusterDiagramNodeStart({
        name: 'New node',
        position: { x, y },
        diagramId: currentDiagram.id
      })
    );

    debouncedUpdateDiagram.flush();
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  return (
    <ClusterArchitectureDiagramStyles>
      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        <CanvasWidget className='diagram-container' engine={engine} />
      </div>
    </ClusterArchitectureDiagramStyles>
  );
};

export default ClusterArchitectureDiagram;
