import { useEffect, useState } from 'react';
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

import { updateClusterInfoStart } from '../../redux/cluster/cluster.actions';

import Section from '../section/section.component';

import {
  SectionRowStyles,
  SectionRowTitleStyles,
  SectionRowValueStyles
} from '../section/section.styles';

const useStyles = makeStyles({
  textField: {
    width: '70%'
  }
});

const ClusterBasicInfoSection = () => {
  const classes = useStyles();

  const { currentCluster, isFetchingCurrentCluster, isUpdatingInfo } =
    useSelector(state => state.cluster);

  const [editMode, setEditMode] = useState(false);

  const [clusterInfo, setClusterInfo] = useState({
    name: '',
    description: ''
  });
  const { name, description } = clusterInfo;

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentCluster && !isFetchingCurrentCluster && !isUpdatingInfo)
      setClusterInfo({
        name: currentCluster.name || '',
        description: currentCluster.description || ''
      });
  }, [currentCluster, isFetchingCurrentCluster, isUpdatingInfo]);

  const handleEditClick = () => setEditMode(true);

  const handleCancelClick = () => {
    setClusterInfo({
      name: currentCluster.name || '',
      description: currentCluster.description || '',
      version: currentCluster.version || ''
    });
    setEditMode(false);
  };

  const handleChange = event => {
    const { name: elementName, value } = event.target;
    setClusterInfo({ ...clusterInfo, [elementName]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    dispatch(updateClusterInfoStart(currentCluster.id, clusterInfo));

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
          {name.length ? (
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
      <CircularProgress size={25} />
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
                name='name'
                type='text'
                value={name}
                onChange={handleChange}
                label='Cluster name'
                variant='outlined'
              />
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Description</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                className={classes.textField}
                autoComplete='off'
                name='description'
                type='text'
                value={description}
                onChange={handleChange}
                label='Description'
                variant='outlined'
                multiline
                rows={4}
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
              <SectionRowValueStyles>{currentCluster.id}</SectionRowValueStyles>
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
            <SectionRowTitleStyles>Description</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>{description}</SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
        </>
      )}
    </Section>
  );
};

export default ClusterBasicInfoSection;
