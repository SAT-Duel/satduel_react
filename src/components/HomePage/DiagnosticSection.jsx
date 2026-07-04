import React from 'react';
import {Typography} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

const {Title, Paragraph} = Typography;

const DiagnosticContainer = styled.div`
    background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
    padding: 80px 0;
    text-align: center;
    border-radius: 24px;
    margin: 60px 0;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.04), transparent);
    }

    @media (max-width: 768px) {
        padding: 40px 20px;
        margin: 30px 0;
    }
`;

const DiagnosticTitle = styled(Title)`
    margin-bottom: 16px !important;
    background: linear-gradient(135deg, #2d2653 0%, #193557 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Poppins', sans-serif;
    font-weight: 600 !important;

    @media (max-width: 768px) {
        font-size: 24px !important;
    }
`;

const DiagnosticCaption = styled(Paragraph)`
    font-size: 1.25rem;
    color: #4a5568;
    margin-bottom: 32px;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
    font-family: 'Poppins', sans-serif;

    @media (max-width: 768px) {
        font-size: 1rem;
        padding: 0 20px;
    }
`;

const DiagnosticButton = styled(Link)`
    position: relative; /* Ensure relative positioning for the button */
    display: inline-flex;
    align-items: center;
    padding: 16px 32px;
    font-size: 1.1rem;
    font-weight: 500;
    color: white;
    background: linear-gradient(135deg, #193557 0%, #312b6c 100%);
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Poppins', sans-serif;
    text-decoration: none;

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
        opacity: 0.4;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        color: white;
        background: linear-gradient(135deg, #312b6c 0%, #193557 100%);
    }

    .icon {
        margin-left: 8px;
        transition: transform 0.3s ease;
    }

    &:hover .icon {
        transform: translateX(4px);
    }

    @media (max-width: 768px) {
        padding: 12px 24px;
        font-size: 1rem;
    }
`;


function DiagnosticSection() {
    return (
        <DiagnosticContainer data-aos="fade-up">
            <DiagnosticTitle level={2}>
                New to the website?
            </DiagnosticTitle>
            <DiagnosticCaption>
                Take our comprehensive FREE diagnostic test to understand your current SAT level
                and get personalized recommendations for improvement.
            </DiagnosticCaption>
            <DiagnosticButton to="/practice_test">
                Start Your Free Diagnostic Test
                <ArrowRightOutlined className="icon"/>
            </DiagnosticButton>
        </DiagnosticContainer>
    );
}

export default DiagnosticSection;