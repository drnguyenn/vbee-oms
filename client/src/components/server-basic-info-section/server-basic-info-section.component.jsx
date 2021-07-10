import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Fade,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import { Close, Check, Edit } from '@material-ui/icons';

import { updateServerStart } from 'redux/server/server.actions';

import Section from 'components/section/section.component';

import ROUTE_PATHS from 'router/route-paths';

import {
  SectionRowStyles,
  SectionRowTitleStyles,
  SectionRowValueStyles
} from 'components/section/section.styles';

const useStyles = makeStyles({
  textField: {
    width: '70%'
  }
});

const ServerBasicInfoSection = () => {
  const classes = useStyles();

  const { currentServer, isUpdatingInfo } = useSelector(state => state.server);

  const [editMode, setEditMode] = useState(false);

  const [serverInfo, setServerInfo] = useState({
    name: '',
    ipAddress: '',
    macAddress: ''
  });
  const { name, ipAddress, macAddress } = serverInfo;

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentServer && !isUpdatingInfo)
      setServerInfo({
        name: currentServer.name || '',
        ipAddress: currentServer.ipAddress || '',
        macAddress: currentServer.macAddress || ''
      });
  }, [currentServer, isUpdatingInfo]);

  const handleEditClick = () => setEditMode(true);

  const handleCancelClick = () => {
    setServerInfo({
      name: currentServer.name || '',
      ipAddress: currentServer.ipAddress || '',
      macAddress: currentServer.macAddress || ''
    });
    setEditMode(false);
  };

  const handleChange = event => {
    const { name: elementName, value } = event.target;
    setServerInfo({ ...serverInfo, [elementName]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    dispatch(updateServerStart(currentServer.id, serverInfo));

    setEditMode(false);
  };

  const HeaderOptions = () => {
    if (editMode)
      return (
        <div>
          <Tooltip title='Cancel' arrow>
            <IconButton onClick={handleCancelClick}>
              <Close />
            </IconButton>
          </Tooltip>
          {name.length && ipAddress.length && macAddress.length ? (
            <Tooltip title='Save' arrow>
              <IconButton onClick={handleSubmit}>
                <Check />
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton disabled>
              <Check />
            </IconButton>
          )}
        </div>
      );

    return isUpdatingInfo ? (
      <CircularProgress size={20} />
    ) : (
      <Tooltip title='Edit' arrow>
        <IconButton onClick={handleEditClick}>
          <Edit />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Section title='Basic info' headerOptions={<HeaderOptions />}>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <SectionRowStyles>
            <SectionRowTitleStyles>Name</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                required
                className={classes.textField}
                autoComplete='off'
                autoFocus
                name='name'
                type='text'
                value={name}
                onChange={handleChange}
                label='Server name'
                variant='outlined'
              />
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>IP Address</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                className={classes.textField}
                autoComplete='off'
                name='ipAddress'
                type='text'
                value={ipAddress}
                onChange={handleChange}
                label='IP Address'
                variant='outlined'
              />
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>MAC Address</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                className={classes.textField}
                autoComplete='off'
                name='macAddress'
                type='text'
                value={macAddress}
                onChange={handleChange}
                label='MAC Address'
                variant='outlined'
              />
            </Fade>
          </SectionRowStyles>
          <input type='submit' hidden />
        </form>
      ) : (
        <>
          <SectionRowStyles>
            <SectionRowTitleStyles>ID</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>{currentServer.id}</SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Name</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>{name}</SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>IP Address</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {ipAddress.toUpperCase()}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>MAC Address</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {macAddress.toUpperCase()}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Cluster</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {currentServer.cluster && (
                  <Link
                    to={`${ROUTE_PATHS.CLUSTERS}/${currentServer.cluster.id}`}
                  >
                    {currentServer.cluster.name}
                  </Link>
                )}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
        </>
      )}
    </Section>
  );
};

export default ServerBasicInfoSection;
