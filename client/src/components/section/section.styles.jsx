import styled from 'styled-components';

import themes from '../../themes';

export const SectionHeaderStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${themes.lengthMd2};
`;

export const SectionTitleAndSubtitleStyles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SectionTitleStyles = styled.span`
  font-size: 1.5rem;
`;

export const SectionSubtitleStyles = styled.span`
  font-size: 1rem;
`;

export const SectionRowStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${themes.lengthSm2} 0;
  white-space: pre-wrap;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionRowTitleStyles = styled.div`
  width: 30%;
  opacity: 0.7;
  font-size: small;
  text-transform: uppercase;
`;

export const SectionRowValueStyles = styled.div`
  width: 70%;
  max-height: 100px;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: initial;
`;
