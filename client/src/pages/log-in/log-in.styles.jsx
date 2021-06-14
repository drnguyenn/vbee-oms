import styled from 'styled-components';

export const LoginPageStyles = styled.div`
  display: flex;
  padding: 1rem;
`;

export const LoginImageContainer = styled.img`
  width: 50%;
  height: 100%;

  @media screen and (max-width: 650px) {
    display: none;
  }
`;

export const LoginAndLogoStyles = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 650px) {
    width: 100%;
  }
`;

export const Logo = styled.img`
  width: 60%;
`;
