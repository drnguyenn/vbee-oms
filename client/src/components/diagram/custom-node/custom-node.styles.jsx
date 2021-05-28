import styled from 'styled-components';

import themes from '../../../themes';

export const CustomNodeStyles = styled.div`
  position: relative;
  border-radius: 5px;
  width: 200px;
  padding: 0 ${themes.lengthSm3} ${themes.lengthSm3} ${themes.lengthSm3};
  cursor: initial;
  background-image: ${({ isSelected }) =>
    isSelected
      ? `linear-gradient(90deg, silver 50%, transparent 50%),
        linear-gradient(90deg, silver 50%, transparent 50%),
        linear-gradient(0deg, silver 50%, transparent 50%),
        linear-gradient(0deg, silver 50%, transparent 50%);`
      : 'none'};
  background-color: ${({ backgroundColor }) => backgroundColor || '#424242'};
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
  background-position: left top, right bottom, left bottom, right top;
  animation: border-dance 1s infinite linear;

  @keyframes border-dance {
    0% {
      background-position: left top, right bottom, left bottom, right top;
    }
    100% {
      background-position: left 15px top, right 15px bottom, left bottom 15px,
        right top 15px;
    }
  }

  :hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  .custom-port {
    margin: 2px -14px 0px -14px;
    width: fit-content;
  }
`;

export const HeaderStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${themes.lengthMd1} 0;
`;

export const TitleStyles = styled.h3`
  margin-right: ${themes.lengthSm2};
  cursor: pointer;
`;

export const PortStyles = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  /* background-color: ${({ type = 'in' }) =>
    type === 'in' ? '#64b5f6' : '#e57373'}; */
  background-color: ${({ backgroundColor = 'grey' }) => backgroundColor};
  cursor: pointer;

  :hover {
    background-color: ${({ hoverBackgroundColor }) =>
      hoverBackgroundColor || '#fab300'};
  }
`;
