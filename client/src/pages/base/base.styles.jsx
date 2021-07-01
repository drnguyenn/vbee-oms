import styled from 'styled-components';

import themes from '../../themes';

export const BasePageStyles = styled.div`
  position: relative;
  top: 65px;
  margin-left: 80px;
  padding: 0 ${themes.lengthMd2} ${themes.lengthMd2};
  text-align: ${({ textAlign }) => textAlign || 'initial'};

  @media screen and (max-width: 650px) {
    margin-left: 60px;
    padding: 0 ${themes.lengthSm2} ${themes.lengthSm2};
  }
`;

export const HeaderStyles = styled.div`
  position: fixed;
  top: 0;
  left: 80px;
  width: calc(100% - 80px);
  height: 65px;
  z-index: 1099;
  text-align: center;
  background-color: ${({ backgroundColor }) => backgroundColor};

  @media screen and (max-width: 650px) {
    left: 60px;
    width: calc(100% - 60px);
  }
`;

export const TitleStyles = styled.h2``;

export const SubtitleStyles = styled.div`
  text-align: center;
  margin-bottom: ${themes.lengthMd3};
  font-size: 1rem;
  color: ${({ color }) => color};
`;
