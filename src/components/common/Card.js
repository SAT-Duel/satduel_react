import styled from 'styled-components';
import { Card as AntdCard } from 'antd';

const Card = styled(AntdCard)`
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  transition: ${props => props.theme.animations.hover};
  background: ${props => props.theme.gradients.card};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

export default Card;