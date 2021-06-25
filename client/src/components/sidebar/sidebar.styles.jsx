import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarStyles = styled.div`
  height: 100%;
  width: 80px;
  position: fixed;
  z-index: 1101;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => (theme === 'dark' ? '#111' : 'inherit')};
  box-shadow: 0.05rem 0 1rem rgba(0, 0, 0, 0.5);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 440px) {
    width: 60px;
  }
`;

export const LogoContainer = styled(Link)`
  text-align: center;
`;

export const Logo = styled.img`
  width: 75%;
`;
