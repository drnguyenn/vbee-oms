import styled from 'styled-components';

export const DrawerStyles = styled.div`
  position: fixed;
  right: 0;
  width: 25%;
  height: 100%;
  padding: 1rem;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  background-color: ${({ backgroundColor }) => backgroundColor || 'initial'};

  @media screen and (max-width: 650px) {
    display: none;
  }
`;

export const HeaderStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BodyStyles = styled.div`
  height: 85%;
  margin-top: 1rem;
  overflow: auto;
`;

export const NodeUpdateFormStyles = styled.form`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SectionRowStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionRowTitleStyles = styled.div`
  width: 45%;
  opacity: 0.7;
  font-size: small;
  text-transform: uppercase;
`;

export const SectionRowValueStyles = styled.div`
  width: 55%;
  font-size: initial;
`;
