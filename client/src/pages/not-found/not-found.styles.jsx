import styled from 'styled-components';

export const NotFoundImageOverlay = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const NotFoundImageStyles = styled.img`
  height: 40%;
`;

export const NotFoundImageTitle = styled.h2`
  font-size: 28px;
`;

export const NotFoundImageContent = styled.h3`
  color: rgba(255, 255, 255, 0.96);
`;
