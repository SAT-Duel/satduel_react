import React from 'react';
import {Card, Button} from 'antd';
import {UserOutlined, CalendarOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const TournamentCardWrapper = styled(Card)`
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .ant-card-body {
        padding: 20px;
    }

    .ant-card-meta-title {
        color: white;
        font-size: 20px;
        margin-bottom: 10px;
        white-space: normal; /* Allows wrapping */
        word-break: break-word; /* Breaks long words if necessary */
    }

    .ant-card-meta-description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;

        p {
            margin-bottom: 8px;
        }
    }
`;


const CardActions = styled.div`
    text-align: center;
    margin-top: 15px;
`;

const TournamentCard = ({tournament}) => {
    return (
        <TournamentCardWrapper hoverable>
            <Card.Meta
                title={tournament.name}
                description={
                    <>
                        <p>
                            <UserOutlined/> {tournament.participantNumber} participants
                        </p>
                        <p>
                            <CalendarOutlined/> Starts: {new Date(tournament.start_time).toLocaleDateString()}
                        </p>
                        <p>
                            <CalendarOutlined/> Ends: {new Date(tournament.end_time).toLocaleDateString()}
                        </p>
                    </>
                }
            />
            <CardActions>
                <Link to={`/tournament/${tournament.id}`}>
                    <Button type="primary">Join Tournament</Button>
                </Link>
            </CardActions>
        </TournamentCardWrapper>
    );
};

export default TournamentCard;
