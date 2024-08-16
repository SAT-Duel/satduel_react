import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from 'react-router-dom';
import {Button, Row, Col, Typography, Card, message} from 'antd';
import {UsergroupAddOutlined, RocketOutlined, LoadingOutlined} from '@ant-design/icons';
import styled, {keyframes} from 'styled-components';

const {Title, Paragraph} = Typography;

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #F5F7FF 0%, #E8EEFF 100%);
    padding: 60px 20px;
`;

const ContentWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const HeroTitle = styled(Title)`
    font-size: 3.5rem;
    color: #0B2F7D;
    margin-bottom: 20px;
    text-align: center;
`;

const HeroParagraph = styled(Paragraph)`
    font-size: 1.25rem;
    color: #4A4A4A;
    max-width: 700px;
    margin: 0 auto 40px;
    text-align: center;
`;

const BigButton = styled(Button)`
    background: #4C3D97;
    color: #fff;
    border: none;
    font-size: 1.25rem;
    height: auto;
    padding: 15px 50px;
    border-radius: 30px;
    margin: 20px auto;
    display: block;
    transition: all 0.3s ease;

    &:hover {
        background: #3C2D87;
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(76, 61, 151, 0.2);
    }
`;

const StyledCard = styled(Card)`
    height: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    }

    .anticon {
        font-size: 2.5rem;
        color: #4C3D97;
    }

    .ant-card-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
`;

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const LoadingIcon = styled(LoadingOutlined)`
    font-size: 3rem;
    color: #4C3D97;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 20px;
`;

const GradientText = styled.span`
    background: linear-gradient(90deg, #2B7FA3, #C95FFB);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const CancelButton = styled(Button)`
    background: #ff4d4f;
    color: #fff;
    border: none;
    font-size: 1.25rem;
    height: auto;
    padding: 15px 50px;
    border-radius: 30px;
    margin: 20px auto;
    display: block;
    transition: all 0.3s ease;

    &:hover {
        background: #d9363e;
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(255, 77, 79, 0.2);
    }
`;


const Match = () => {
    const {token, loading, user} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        if (!loading && !user){
            message.error("You do not have the permission to view this page");
            navigate('/');
        }
        if (!loading && !user.is_admin){
            message.error("You do not have the permission to view this page");
            navigate('/');
        }
    }, [loading,user])

    return (
        <Container>
            <ContentWrapper>
                <HeroTitle level={1}>Admin Page</HeroTitle>
                <HeroParagraph>
                    Contains various tools that admins can use to help the development process!
                </HeroParagraph>

                <Row gutter={[24, 24]} style={{marginTop: '60px'}}>
                    <Col xs={24} md={12}>
                        <StyledCard>
                            <RocketOutlined/>
                            <Title level={3} style={{marginTop: '20px', color: '#0B2F7D'}}>How It Works</Title>
                            <Paragraph style={{fontSize: '1rem', color: '#4A4A4A'}}>
                                Our platform matches you with other students based on your skill level.
                                Click the "Find a Match" button and get paired up for an exciting duel.
                            </Paragraph>
                        </StyledCard>
                    </Col>
                    <Col xs={24} md={12}>
                        <StyledCard>
                            <UsergroupAddOutlined/>
                            <Title level={3} style={{marginTop: '20px', color: '#0B2F7D'}}>Challenge a Friend</Title>
                            <Paragraph style={{fontSize: '1rem', color: '#4A4A4A'}}>
                                Want to challenge a specific friend to a duel? Send them an invite and see who comes out
                                on top.
                                (Coming Soon)
                            </Paragraph>
                        </StyledCard>
                    </Col>
                </Row>
            </ContentWrapper>
        </Container>
    );
};

export default Match;
