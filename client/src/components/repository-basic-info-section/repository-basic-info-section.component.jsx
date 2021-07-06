import { useSelector } from 'react-redux';

import { Divider, Fade } from '@material-ui/core';

import Section from '../section/section.component';

import {
  SectionRowStyles,
  SectionRowTitleStyles,
  SectionRowValueStyles
} from '../section/section.styles';

const RepositoryBasicInfoSection = () => {
  const { currentRepository } = useSelector(state => state.repository);
  const { githubId, name, owner, url, private: isPrivate } = currentRepository;

  return (
    <Section title='Basic info'>
      <SectionRowStyles>
        <SectionRowTitleStyles>ID</SectionRowTitleStyles>
        <Fade in timeout={500}>
          <SectionRowValueStyles>{currentRepository.id}</SectionRowValueStyles>
        </Fade>
      </SectionRowStyles>
      <Divider />
      <SectionRowStyles>
        <SectionRowTitleStyles>GitHub ID</SectionRowTitleStyles>
        <Fade in timeout={500}>
          <SectionRowValueStyles>{githubId}</SectionRowValueStyles>
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
        <SectionRowTitleStyles>Owner</SectionRowTitleStyles>
        <Fade in timeout={500}>
          <SectionRowValueStyles>
            <a
              href={`https://github.com/${owner}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {owner}
            </a>
          </SectionRowValueStyles>
        </Fade>
      </SectionRowStyles>
      <Divider />
      <SectionRowStyles>
        <SectionRowTitleStyles>URL</SectionRowTitleStyles>
        <Fade in timeout={500}>
          <SectionRowValueStyles>
            <a href={url} target='_blank' rel='noopener noreferrer'>
              {url}
            </a>
          </SectionRowValueStyles>
        </Fade>
      </SectionRowStyles>
      <Divider />
      <SectionRowStyles>
        <SectionRowTitleStyles>Visibility</SectionRowTitleStyles>
        <Fade in timeout={500}>
          <SectionRowValueStyles>
            {isPrivate ? 'Private' : 'Public'}
          </SectionRowValueStyles>
        </Fade>
      </SectionRowStyles>
    </Section>
  );
};

export default RepositoryBasicInfoSection;
