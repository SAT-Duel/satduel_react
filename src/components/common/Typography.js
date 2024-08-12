import styled from 'styled-components';

export const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
`;

export const Text = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;