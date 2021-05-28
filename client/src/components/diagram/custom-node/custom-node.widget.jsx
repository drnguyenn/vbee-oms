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
  Fade
} from '@material-ui/core';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import {
  Add,
  CheckCircle,
  Close,
  Delete,
  Info,
  MoreVert
} from '@material-ui/icons';

import {
  setSelectedDiagramNode,
  updateClusterDiagramNodeStart,
  addClusterDiagramPortStart,
  // updateClusterDiagramPortStart,
  removeClusterDiagramPortStart
} from '../../../redux/diagram/diagram.actions';
import { toggleDiagramNodeRemoveConfirmationModal } from '../../../redux/modal/modal.actions';

import { debouncedUpdateDiagram } from '../../../utils/diagram.utils';

import {
  CustomNodeStyles,
  HeaderStyles,
  TitleStyles,
  PortStyles
} from './custom-node.styles';

const useStyles = makeStyles(muiTheme => ({
  success: {
    color: muiTheme.palette.success.light
  },
  speedDial: {
    position: 'absolute',
    right: -176,
    bottom: 0
  }
}));

const nodeMenuPropsAreEqual = (prevProps, nextProps) =>
  prevProps.node.id === nextProps.node.id &&
  prevProps.node.name === nextProps.node.name;

const NodeActionMenu = memo(({ node }) => {
  const classes = useStyles();

  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const { currentDiagram } = useSelector(state => state.diagram);

  const dispatch = useDispatch();

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
  };

  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
  };

  return (
    <SpeedDial
      ariaLabel='NodeActionSpeedDial'
      className={classes.speedDial}
      icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<Close />} />}
      onOpen={handleSpeedDialOpen}
      onClose={handleSpeedDialClose}
      open={speedDialOpen}
      direction='right'
      FabProps={{ size: 'small', color: 'default' }}
    >
      <SpeedDialAction
        icon={<Add />}
        tooltipTitle='Add port'
        tooltipPlacement='top'
        onClick={() => {
          dispatch(
            addClusterDiagramPortStart({
              options: { in: false },
              nodeId: node.id,
              diagramId: currentDiagram.id
            })
          );

          debouncedUpdateDiagram.flush();
        }}
      />
      <SpeedDialAction
        icon={<Info />}
        tooltipTitle='Details'
        tooltipPlacement='top'
        onClick={handleSpeedDialClose}
      />
      <SpeedDialAction
        icon={<Delete color='secondary' />}
        tooltipTitle='Remove'
        tooltipPlacement='top'
        onClick={() => {
          dispatch(
            setSelectedDiagramNode({
              id: node.id,
              name: node.name,
              callback: () => {
                node.remove();
              }
            })
          );
          dispatch(toggleDiagramNodeRemoveConfirmationModal());
        }}
      />
    </SpeedDial>
  );
}, nodeMenuPropsAreEqual);

const initialMenu = {
  mouseX: null,
  mouseY: null
};

const portMenuPropsAreEqual = (prevProps, nextProps) =>
  // prevProps.selectedPort === nextProps.selectedPort &&
  prevProps.mouseX === nextProps.mouseX &&
  prevProps.mouseY === nextProps.mouseY;

const PortActionMenu = memo(
  ({
    mouseX,
    mouseY,
    handleClose,
    // handleSwitchPort,
    handleRemovePort
    // selectedPort
  }) => (
    <Menu
      open={Boolean(mouseY)}
      onClose={handleClose}
      anchorReference='anchorPosition'
      anchorPosition={
        mouseY && mouseX ? { top: mouseY, left: mouseX } : undefined
      }
    >
      {/* {selectedPort && isEmpty(selectedPort.getLinks()) && (
        <MenuItem onClick={handleSwitchPort}>
          Switch to {selectedPort.options.in ? 'out' : 'in'} port
        </MenuItem>
      )} */}
      <MenuItem onClick={handleRemovePort}>Remove port</MenuItem>
    </Menu>
  ),
  portMenuPropsAreEqual
);

const CustomNodeWidget = ({ engine, node }) => {
  const classes = useStyles();

  const [portActionMenu, setPortActionMenu] = useState(initialMenu);
  const { mouseX, mouseY } = portActionMenu;

  const [selectedPort, setSelectedPort] = useState();

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

  const handlePortActionMenuOpen = event => {
    event.preventDefault();

    setPortActionMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    });
  };

  const handlePortActionMenuClose = () => {
    setPortActionMenu(initialMenu);
    setSelectedPort(null);
  };

  const handleContextMenu = port => event => {
    handlePortActionMenuOpen(event);
    setSelectedPort(port);
  };

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

  return (
    <CustomNodeStyles
      backgroundColor={theme.palette.background.paper}
      isSelected={node.serialize().selected}
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
          <TitleStyles onDoubleClick={() => setEditMode(true)}>
            {name}
          </TitleStyles>
        )}

        <CheckCircle className={classes.success} color='primary' />
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
              backgroundColor={theme.palette.primary.main}
              hoverBackgroundColor={theme.palette.primary.dark}
              onContextMenu={handleContextMenu(port)}
            />
          </PortWidget>
        );
      })}

      <NodeActionMenu node={node} />

      <PortActionMenu
        {...{
          mouseX,
          mouseY,
          handleClose: handlePortActionMenuClose,
          // handleSwitchPort: () => {
          //   dispatch(
          //     updateClusterDiagramPortStart(
          //       currentDiagram.id,
          //       selectedPort.options.id,
          //       {
          //         options: { in: !selectedPort.options.in }
          //       }
          //     )
          //   );

          //   handlePortActionMenuClose();
          // },
          handleRemovePort: () => {
            if (selectedPort)
              dispatch(
                removeClusterDiagramPortStart(selectedPort.options.id, () => {
                  Object.values(selectedPort.getLinks()).forEach(link =>
                    link.remove()
                  );
                  node.removePort(selectedPort);
                })
              );

            handlePortActionMenuClose();
          }
          // selectedPort
        }}
      />
    </CustomNodeStyles>
  );
};

export default CustomNodeWidget;
