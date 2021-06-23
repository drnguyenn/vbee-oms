import styled from 'styled-components';

export const ClusterArchitectureDiagramStyles = styled.div`
  position: fixed;
  width: 90%;
  height: 100%;

  background-size: 45px 45px;
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 15px,
      rgba(0, 0, 0, 0.1) 15px,
      transparent 16px,
      transparent 30px,
      rgba(0, 0, 0, 0.1) 30px,
      transparent 31px
    ),
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 15px,
      rgba(0, 0, 0, 0.1) 15px,
      transparent 16px,
      transparent 30px,
      rgba(0, 0, 0, 0.1) 30px,
      transparent 31px
    );

  .diagram-container {
    position: absolute !important;
    width: 100%;
    height: 100%;
    z-index: 1400;
  }
`;
