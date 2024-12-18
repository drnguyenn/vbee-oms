import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderStyles = styled.div`
  position: fixed;
  top: 0;
  width: -webkit-fill-available;
  height: 65px;
  margin-left: 80px;
  z-index: 1100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;

  @media screen and (max-width: 650px) {
    margin-left: 60px;
    padding: 0 10px;
  }
`;

export const OptionsContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OptionLink = styled(Link)`
  padding: 10px 15px;
  cursor: pointer;
`;
