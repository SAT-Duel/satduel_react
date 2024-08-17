import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Card } from 'antd';
import { FileTextOutlined, DatabaseOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import withAuth from "../../hoc/withAuth";

const { Title, Paragraph } = Typography;

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #F5F7FF 0%, #E8EEFF 100%);
    padding: 60px 20px;
`;

const ContentWrapper = styled.div`
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
`;

const HeroTitle = styled(Title)`
    font-size: 3rem;
    color: #0B2F7D;
    margin-bottom: 40px;
`;

const StyledCard = styled(Card)`
    height: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        cursor: pointer;
    }

    .anticon {
        font-size: 3rem;
        color: #4C3D97;
    }

    .ant-card-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
`;

const AdminHome = () => {
    const navigate = useNavigate();

    const handleNavigateToQuestions = () => {
        navigate('/admin/questions');
    };

    const handleNavigateToBackend = () => {
        // Placeholder link, replace with your actual backend database link
        window.location.href = 'https://satduel-e07814415d4e.herokuapp.com/admin/';
    };

    return (
        <Container>
            <ContentWrapper>
                <HeroTitle level={1}>Admin Tools</HeroTitle>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <StyledCard onClick={handleNavigateToQuestions}>
                            <FileTextOutlined />
                            <Title level={4} style={{ marginTop: '20px', color: '#0B2F7D' }}>Question List</Title>
                            <Paragraph style={{ fontSize: '1rem', color: '#4A4A4A' }}>
                                Manage and edit the questions in the database.
                            </Paragraph>
                        </StyledCard>
                    </Col>
                    <Col xs={24} md={12}>
                        <StyledCard onClick={handleNavigateToBackend}>
                            <DatabaseOutlined />
                            <Title level={4} style={{ marginTop: '20px', color: '#0B2F7D' }}>Backend Database</Title>
                            <Paragraph style={{ fontSize: '1rem', color: '#4A4A4A' }}>
                                Access and manage the backend database.
                            </Paragraph>
                        </StyledCard>
                    </Col>
                </Row>
            </ContentWrapper>
        </Container>
    );
};

export default withAuth(AdminHome, true);
