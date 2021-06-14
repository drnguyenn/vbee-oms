import styled from 'styled-components';

export const LoginPageStyles = styled.div`
  display: flex;

  @media screen and (max-width: 650px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const LoginImageContainer = styled.img`
  width: 50%;
  height: 100%;

  @media screen and (max-width: 650px) {
    width: 80%;
  }
`;

export const LoginAndLogoStyles = styled.div`
  width: 50%;
  margin-top: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 650px) {
    width: 80%;
  }
`;

export const Logo = styled.img`
  width: 60%;
`;
