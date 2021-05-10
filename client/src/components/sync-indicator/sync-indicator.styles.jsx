import styled from 'styled-components';

export const SyncIndicatorStyles = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
`;

export const Spinner = styled.span`
  height: 35px;
  animation: ${({ spin = false }) =>
    spin ? 'spin 1s linear infinite' : 'none'};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      -webkit-transform: rotate(360deg);
    }
  }
`;
