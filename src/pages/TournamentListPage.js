import React, {useEffect, useState} from 'react';
import {Layout, Typography, Card, Row, Col, Button} from 'antd';
import {TrophyOutlined, UserOutlined, CalendarOutlined, PlusCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
import {Link} from "react-router-dom";
import styled from "styled-components";

const {Content} = Layout;
const {Title} = Typography;

const CTAButton = styled(Button)`
    font-size: 18px;
    height: auto;
    padding: 12px 24px;
    border-radius: 8px;
    background: #ff4500;
    border-color: #ff4500;

    &:hover, &:focus {
        background: #ff6347;
        border-color: #ff6347;
    }
`;

const TournamentListPage = () => {
    const [tournaments, setTournaments] = useState([]);
    const baseUrl = process.env.REACT_APP_API_URL;


    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/tournaments/`);
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments();
    }, [baseUrl]);

    return (
        <Layout>
            <Content style={{padding: '50px'}}>
                <Title level={2} style={{marginBottom: '30px'}}>SAT Prep Tournaments</Title>
                <Link to="/create_tournament">
                    <CTAButton type="primary" size="large" icon={<PlusCircleOutlined/>} style={{marginLeft: '10px'}}>
                        Create Tournament
                    </CTAButton>
                </Link>
                <Row gutter={[16, 16]}>
                    {tournaments.map(tournament => (
                        <Col xs={24} sm={12} md={8} lg={6} key={tournament.id}>
                            <Card
                                hoverable
                                cover={<div style={{
                                    height: 120,
                                    background: '#1890ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <TrophyOutlined style={{fontSize: 48, color: '#fff'}}/>
                                </div>}
                                actions={[
                                    <Link to={`/tournament/${tournament.id}`}>
                                        <Button type="primary">Join Tournament</Button>
                                    </Link>,
                                ]}
                            >
                                <Card.Meta
                                    title={tournament.name}
                                    description={
                                        <>
                                            <p><UserOutlined/> {tournament.participantNumber} participants</p>
                                            <p>
                                                <CalendarOutlined/> Starts: {new Date(tournament.start_time).toLocaleDateString()}
                                            </p>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>
        </Layout>
    );
};

export default TournamentListPage;
