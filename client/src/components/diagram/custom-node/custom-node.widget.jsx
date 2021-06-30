/* eslint-disable no-unused-vars */
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { isEmpty } from 'lodash';
import { PortWidget } from '@projectstorm/react-diagrams';

import {
  Menu,
  MenuItem,
  makeStyles,
  useTheme,
  TextField,
  Typography,
  Fade,
  Tooltip,
  withStyles
} from '@material-ui/core';
import { CheckCircle, Delete, Info } from '@material-ui/icons';

import {
  setSelectedDiagramNode,
  updateClusterDiagramNodeStart,
  setShowDrawer
} from '../../../redux/diagram/diagram.actions';
import { setDiagramNodeRemovalConfirmationModalOpen } from '../../../redux/modal/modal.actions';

import {
  CustomNodeStyles,
  HeaderStyles,
  TitleStyles,
  PortStyles,
  TooltipRowStyles,
  TooltipRowTitleStyles,
  TooltipRowValueStyles
} from './custom-node.styles';

const useStyles = makeStyles(muiTheme => ({
  success: {
    color: muiTheme.palette.success.light
  },
  nodeActionMenuIcon: {
    marginRight: '1rem'
  },
  metricsDefault: {},
  metricsLow: {
    color: muiTheme.palette.success.main
  },
  metricsMedium: {
    color: muiTheme.palette.warning.main
  },
  metricsHigh: {
    color: muiTheme.palette.error.main
  }
}));

const MetricsTooltip = withStyles(() => ({
  tooltip: {
    minWidth: 200,
    padding: 10
  }
}))(Tooltip);

const initialMenu = {
  mouseX: null,
  mouseY: null
};

const nodeMenuPropsAreEqual = (prevProps, nextProps) =>
  prevProps.node.id === nextProps.node.id &&
  prevProps.node.name === nextProps.node.name &&
  prevProps.nodeActionMenu === nextProps.nodeActionMenu;

const NodeActionMenu = memo(
  ({ node, nodeActionMenu: { mouseX, mouseY }, handleClose }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const handleDetailsClick = () => {
      dispatch(setSelectedDiagramNode(node));
      dispatch(setShowDrawer(true));

      handleClose();
    };

    const handleRemoveClick = () => {
      dispatch(
        setSelectedDiagramNode({
          ...node,
          callback: () => node.remove()
        })
      );
      dispatch(setDiagramNodeRemovalConfirmationModalOpen(true));

      handleClose();
    };

    return (
      <Menu
        open={Boolean(mouseY)}
        onClose={handleClose}
        anchorReference='anchorPosition'
        anchorPosition={
          mouseY && mouseX ? { top: mouseY, left: mouseX } : undefined
        }
      >
        <MenuItem onClick={handleDetailsClick}>
          <Info className={classes.nodeActionMenuIcon} />
          <Typography>Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleRemoveClick}>
          <Delete className={classes.nodeActionMenuIcon} color='secondary' />
          <Typography>Remove</Typography>
        </MenuItem>
      </Menu>
    );
  },
  nodeMenuPropsAreEqual
);

// const portMenuPropsAreEqual = (prevProps, nextProps) =>
//   prevProps.selectedPort === nextProps.selectedPort &&
//   prevProps.portActionMenu === nextProps.portActionMenu;

// const PortActionMenu = memo(
//   ({
//     portActionMenu: { mouseX, mouseY },
//     handleClose,
//     handleSwitchPort,
//     handleRemovePort,
//     selectedPort
//   }) => (
//     <Menu
//       open={Boolean(mouseY)}
//       onClose={handleClose}
//       anchorReference='anchorPosition'
//       anchorPosition={
//         mouseY && mouseX ? { top: mouseY, left: mouseX } : undefined
//       }
//     >
//       {selectedPort && isEmpty(selectedPort.getLinks()) && (
//         <MenuItem onClick={handleSwitchPort}>
//           Switch to {selectedPort.options.in ? 'out' : 'in'} port
//         </MenuItem>
//       )}
//       <MenuItem onClick={handleRemovePort}>Remove port</MenuItem>
//     </Menu>
//   ),
//   portMenuPropsAreEqual
// );

const getMetricClassName = (metric = 0) => {
  if (!metric) return 'metricsDefault';
  if (metric < 50) return 'metricsLow';
  if (metric < 80) return 'metricsMedium';
  if (metric < 100) return 'metricsHigh';
  return '';
};

const CustomNodeWidget = ({ engine, node }) => {
  const classes = useStyles();

  const { service } = node;

  const { selectedNode } = useSelector(state => state.diagram);

  const [nodeActionMenu, setNodeActionMenu] = useState(initialMenu);

  const [editMode, setEditMode] = useState(false);
  node.setEditMode(editMode);

  const [nodeInfo, setNodeInfo] = useState({
    name: ''
  });
  const { name } = nodeInfo;

  const theme = useTheme();

  const ports = node.getPorts();

  const dispatch = useDispatch();

  useEffect(() => {
    if (node && !editMode)
      setNodeInfo({
        name: node.name || ''
      });
  }, [editMode, node]);

  const handleNodeClick = () => {
    if (!selectedNode || selectedNode.id !== node.id)
      dispatch(setSelectedDiagramNode(node));
  };

  const handlePortClick = event => event.stopPropagation();

  const handleNodeActionMenuOpen = event => {
    event.preventDefault();

    dispatch(setSelectedDiagramNode(node));

    setNodeActionMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    });
  };

  const handleNodeActionMenuClose = () => setNodeActionMenu(initialMenu);

  const handleChange = event => {
    const { name: elementName, value } = event.target;
    setNodeInfo({ ...nodeInfo, [elementName]: value });
  };

  const handleEscKeyUp = event => {
    if (event.key === 'Escape') {
      setNodeInfo({
        name: node.name || ''
      });
      setEditMode(false);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    dispatch(updateClusterDiagramNodeStart(node.id, nodeInfo));

    setEditMode(false);
  };

  const getMetrics = () => {
    if (service) {
      if (service.server) {
        const { metrics = {} } = service.server;

        return (
          <MetricsTooltip
            interactive
            arrow
            title={
              <>
                <TooltipRowStyles>
                  <TooltipRowTitleStyles>IP</TooltipRowTitleStyles>
                  <TooltipRowValueStyles>
                    {service ? service.server.ipAddress : '--'}
                  </TooltipRowValueStyles>
                </TooltipRowStyles>
                <TooltipRowStyles>
                  <TooltipRowTitleStyles>CPU</TooltipRowTitleStyles>
                  <TooltipRowValueStyles>
                    {metrics.cpuUsage > 0
                      ? `${metrics.cpuUsage.toFixed(1)}%`
                      : '--'}
                  </TooltipRowValueStyles>
                </TooltipRowStyles>
                <TooltipRowStyles>
                  <TooltipRowTitleStyles>RAM</TooltipRowTitleStyles>
                  <TooltipRowValueStyles>
                    {metrics.memoryUsage > 0
                      ? `${metrics.memoryUsage.toFixed(1)}%`
                      : '--'}
                  </TooltipRowValueStyles>
                </TooltipRowStyles>
                <TooltipRowStyles>
                  <TooltipRowTitleStyles>Net in</TooltipRowTitleStyles>
                  <TooltipRowValueStyles>
                    {metrics.networkIn > 0
                      ? `${metrics.networkIn.toFixed(1)} KB/s`
                      : '--'}
                  </TooltipRowValueStyles>
                </TooltipRowStyles>
                <TooltipRowStyles>
                  <TooltipRowTitleStyles>Net out</TooltipRowTitleStyles>
                  <TooltipRowValueStyles>
                    {metrics.networkOut > 0
                      ? `${metrics.networkOut.toFixed(1)} KB/s`
                      : '--'}
                  </TooltipRowValueStyles>
                </TooltipRowStyles>
              </>
            }
          >
            <Typography
              className={
                service.server.metrics
                  ? classes[getMetricClassName(service.server.metrics.cpuUsage)]
                  : classes.metricsDefault
              }
              variant='h6'
              component='span'
              display='inline'
            >
              {service.server.metrics && service.server.metrics.cpuUsage > 0
                ? `${service.server.metrics.cpuUsage.toFixed(1)}%`
                : '--'}
            </Typography>
          </MetricsTooltip>
        );
      }

      return (
        <Typography variant='h6' component='span' display='inline'>
          --
        </Typography>
      );
    }

    return null;
  };

  return (
    <>
      <CustomNodeStyles
        outlineBorderColor={theme.palette.primary.light}
        backgroundColor={theme.palette.background.paper}
        isSelected={node.serialize().selected}
        onClick={handleNodeClick}
        onContextMenu={handleNodeActionMenuOpen}
      >
        <HeaderStyles>
          {editMode ? (
            <Fade in timeout={500}>
              <form onSubmit={handleSubmit}>
                <TextField
                  autoComplete='off'
                  autoFocus
                  name='name'
                  type='text'
                  value={name}
                  onChange={handleChange}
                  onKeyUp={handleEscKeyUp}
                  label='Node name'
                  variant='outlined'
                  margin='dense'
                />
              </form>
            </Fade>
          ) : (
            <Tooltip title={name} placement='top' arrow enterDelay={500}>
              <TitleStyles
                onDoubleClick={() => {
                  setEditMode(true);
                  setSelectedDiagramNode(node);
                }}
              >
                {name.length <= 14 ? name : `${name.substring(0, 14)}...`}
              </TitleStyles>
            </Tooltip>
          )}

          {service && (
            <CheckCircle className={classes.success} color='primary' />
          )}
        </HeaderStyles>

        {Object.keys(ports).map(key => {
          const port = ports[key];

          return (
            <PortWidget
              className='custom-port'
              key={port.options.id}
              engine={engine}
              port={port}
            >
              <PortStyles
                hoverBackgroundColor={theme.palette.primary.dark}
                alignment={port.options.alignment}
                onClick={handlePortClick}
              />
            </PortWidget>
          );
        })}

        {getMetrics()}
      </CustomNodeStyles>

      <NodeActionMenu
        {...{ node, nodeActionMenu, handleClose: handleNodeActionMenuClose }}
      />
    </>
  );
};

export default CustomNodeWidget;
