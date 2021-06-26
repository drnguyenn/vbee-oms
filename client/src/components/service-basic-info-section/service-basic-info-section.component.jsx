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

import { updateServiceStart } from '../../redux/service/service.actions';

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

const ServiceBasicInfoSection = () => {
  const classes = useStyles();

  const { currentService, isFetchingCurrentService, isUpdatingInfo } =
    useSelector(state => state.service);

  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);

  const [serviceInfo, setServiceInfo] = useState({
    name: '',
    description: '',
    version: ''
  });
  const { name, description, version } = serviceInfo;

  useEffect(() => {
    if (currentService && !isFetchingCurrentService && !isUpdatingInfo)
      setServiceInfo({
        name: currentService.name || '',
        description: currentService.description || '',
        version: currentService.version || ''
      });
  }, [currentService, isFetchingCurrentService, isUpdatingInfo]);

  const handleEditClick = () => setEditMode(true);

  const handleCancelClick = () => {
    setServiceInfo({
      name: currentService.name || '',
      description: currentService.description || '',
      version: currentService.version || ''
    });
    setEditMode(false);
  };

  const handleChange = event => {
    const { name: elementName, value } = event.target;
    setServiceInfo({ ...serviceInfo, [elementName]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch(updateServiceStart(currentService.id, serviceInfo));

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
                autoFocus
                name='name'
                type='text'
                value={name}
                onChange={handleChange}
                label='Service name'
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
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Version</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <TextField
                className={classes.textField}
                autoComplete='off'
                name='version'
                type='text'
                value={version}
                onChange={handleChange}
                label='Version'
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
              <SectionRowValueStyles>{currentService.id}</SectionRowValueStyles>
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
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Cluster</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>
                {currentService.cluster && currentService.cluster.name}
              </SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
          <Divider />
          <SectionRowStyles>
            <SectionRowTitleStyles>Version</SectionRowTitleStyles>
            <Fade in timeout={500}>
              <SectionRowValueStyles>{version}</SectionRowValueStyles>
            </Fade>
          </SectionRowStyles>
        </>
      )}
    </Section>
  );
};

export default ServiceBasicInfoSection;
