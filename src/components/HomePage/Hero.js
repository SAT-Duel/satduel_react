import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowDownOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

export const GlobalStyle = styled.div`
    font-family: 'Poppins', sans-serif;
`;

const HeroSection = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(75deg, #193557 0%, #2d2653 100%);
    color: white;
    text-align: center;
    padding: 0 20px;
`;

const HeroTitle = styled(Title)`
    font-size: 4rem !important;
    margin-bottom: 20px;
    font-weight: 500;
    @media (max-width: 768px) {
        font-size: 3rem !important;
    }
    @media (max-width: 576px) {
        font-size: 2.5rem !important;
    }
`;

const HeroParagraph = styled(Paragraph)`
    font-size: 1.5rem;
    max-width: 600px;
    margin-bottom: 40px;
    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
    @media (max-width: 576px) {
        font-size: 1rem;
    }
`;

const GradientText = styled.span`
    background: linear-gradient(75deg, #8f73ff 0%, #34acfb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Poppins', sans-serif;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 20px;
    @media (max-width: 576px) {
        flex-direction: column;
        width: 100%;
        align-items: center;
    }
`;

const StyledTitleButton = styled.button`
    position: relative;
    background: #1a1a1a;
    border: none;
    color: white;
    font-size: 1.2rem;
    padding: 10px 20px;
    height: auto;
    overflow: visible;
    transition: all 0.3s ease;
    border-radius: 10px;
    z-index: 0;
    margin-right: 20px;
    font-family: 'Poppins', sans-serif;

    @media (max-width: 576px) {
        font-size: 1rem;
        padding: 8px 16px;
        margin-right: 0;
        margin-bottom: 10px;
        width: 100%;
    }

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 110%;
        height: 110%;
        background: conic-gradient(#bfa6ed, #789afb, #7f73ff, #786cae, #bfa6ed);
        border-radius: 15px;
        z-index: -2;
        filter: blur(9px);
        opacity: 40%;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        border-radius: 10px;
        z-index: -1;
        opacity: 0.62;
    }

    &:hover {
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    a {
        color: white;
        text-decoration: none;
        font-weight: 500;
    }

    &:hover a {
        color: #c0d0fd;
    }
`;
const ScrollIndicator = styled.div`
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    animation: bounce 2s infinite;
    cursor: pointer;

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
        }
        40% {
            transform: translateY(-30px) translateX(-50%);
        }
        60% {
            transform: translateY(-15px) translateX(-50%);
        }
    }
`;

interface HeroProps {
    onScrollClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({onScrollClick}) => {
    return (
        <HeroSection>
            <HeroTitle level={1}>
        <span style={{color: '#FFFFFF', fontFamily: 'Poppins, sans-serif', fontWeight: 500}}>
          Elevate Your SAT Prep with{' '}
        </span>
                <GradientText style={{fontWeight: 500}}>Duels</GradientText>
            </HeroTitle>
            <HeroParagraph>
                <span style={{color: '#FFFFFF'}}> Immerse yourself in a </span>
                <GradientText>futuristic</GradientText>
                <span style={{color: '#FFFFFF'}}> learning experience designed to </span>
                <GradientText>boost</GradientText>
                <span style={{color: '#FFFFFF'}}> your SAT scores. </span>
            </HeroParagraph>
            <ButtonContainer>
                <StyledTitleButton>
                    <Link to="/practice_test" style={{fontWeight: 500}}>
                        Try a Diagnostic Test
                    </Link>
                </StyledTitleButton>
                <StyledTitleButton>
                    <Link to="/match" style={{fontWeight: 500}}>
                        Challenge a Friend
                    </Link>
                </StyledTitleButton>
            </ButtonContainer>
            <ScrollIndicator onClick={onScrollClick}>
                <ArrowDownOutlined style={{fontSize: '24px'}}/>
            </ScrollIndicator>
        </HeroSection>
    );
};