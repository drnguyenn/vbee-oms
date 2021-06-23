import styled, { css } from 'styled-components';

import themes from '../../../themes';

const nodeWidth = '200px';
const nodeMinHeight = '100px';
const portThickness = '4px';
const borderRadius = '5px';

const TopPortStyles = css`
  top: 0;
  left: 0;
  height: ${portThickness};
  width: ${nodeWidth};
  border-radius: ${borderRadius} ${borderRadius} 0 0;
`;

const RightPortStyles = css`
  top: 0;
  right: 0;
  height: ${nodeMinHeight};
  width: ${portThickness};
  border-radius: 0 ${borderRadius} ${borderRadius} 0;
`;

const BottomPortStyles = css`
  bottom: 0;
  left: 0;
  height: ${portThickness};
  width: ${nodeWidth};
  border-radius: 0 0 ${borderRadius} ${borderRadius};
`;

const LeftPortStyles = css`
  top: 0;
  left: 0;
  height: ${nodeMinHeight};
  width: ${portThickness};
  border-radius: ${borderRadius} 0 0 ${borderRadius};
`;

const getPortStyles = ({ alignment }) => {
  switch (alignment) {
    case 'top':
      return TopPortStyles;

    case 'right':
      return RightPortStyles;

    case 'bottom':
      return BottomPortStyles;

    case 'left':
      return LeftPortStyles;

    default:
      return null;
  }
};

export const PortStyles = styled.div`
  position: absolute;

  cursor: pointer;

  ${getPortStyles}:hover {
    background-color: ${({ hoverBackgroundColor }) =>
      hoverBackgroundColor || '#fab300'};
  }
`;

export const CustomNodeStyles = styled.div`
  position: relative;
  border-radius: ${borderRadius};
  width: ${nodeWidth};
  min-height: ${nodeMinHeight};
  padding: 0 ${themes.lengthSm3} ${themes.lengthSm3} ${themes.lengthSm3};
  text-align: center;
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
`;

export const HeaderStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitleStyles = styled.h3`
  margin-right: ${themes.lengthSm2};
  cursor: pointer;
`;

export const TooltipRowStyles = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 8px 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TooltipRowTitleStyles = styled.div`
  width: 40%;
  opacity: 0.7;
  font-size: 0.65rem;
  text-transform: uppercase;
`;

export const TooltipRowValueStyles = styled.div`
  width: 60%;
  font-size: 0.875rem;
`;
