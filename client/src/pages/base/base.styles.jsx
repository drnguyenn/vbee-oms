import styled from 'styled-components';

import themes from '../../themes';

export const BasePageStyles = styled.div`
  position: relative;
  top: 65px;
  margin-left: 80px;
  padding: 0 ${themes.lengthMd2} ${themes.lengthMd2};
`;

export const HeaderStyles = styled.div`
  position: fixed;
  top: 0;
  left: 80px;
  width: 94%;
  height: 65px;
  z-index: 1099;
  text-align: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const TitleStyles = styled.h2``;

export const SubtitleStyles = styled.div`
  text-align: center;
  margin-bottom: ${themes.lengthMd3};
  font-size: 1rem;
  color: ${({ color }) => color};
`;
