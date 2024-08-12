import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${props => props.theme.gradients.primary};
`;

export default PageContainer;