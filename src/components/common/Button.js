import styled, {css} from 'styled-components';
import {Button as AntdButton} from 'antd';

const buttonStyles = css`
    border-radius: ${props => props.theme.borderRadius.small};
    font-weight: bold;
    transition: ${props => props.theme.animations.hover};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${props => props.theme.shadows.small};
    }
`;

export const PrimaryButton = styled(AntdButton)`
    ${buttonStyles}
    background: ${props => props.theme.gradients.primary};
    border: none;
    color: ${props => props.theme.colors.text.light};

    &:hover {
        background: ${props => props.theme.gradients.primary};
        opacity: 0.9;
    }
`;

export const SecondaryButton = styled(AntdButton)`
    ${buttonStyles}
    background: transparent;
    border: 2px solid ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};

    &:hover {
        background: ${props => props.theme.colors.primary};
        color: ${props => props.theme.colors.text.light};
    }
`;

export const AccentButton = styled(AntdButton)`
    ${buttonStyles}
    background: ${props => props.theme.gradients.accent};
    border: none;
    color: ${props => props.theme.colors.text.light};

    &:hover {
        background: ${props => props.theme.gradients.accent};
        opacity: 0.9;
    }
`;