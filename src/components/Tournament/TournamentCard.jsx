import React from 'react';
import { Card, Typography, Space, Button, Tooltip, Progress } from 'antd';
import { 
    TeamOutlined,
    ClockCircleOutlined,
    RightOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);
    transition: all 0.3s ease;
    height: 100%;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
`;

const StatusBadge = styled.div`
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    color: white;
    background: ${props => {
        switch(props.status) {
            case 'active':
                return 'linear-gradient(135deg, #34d399 0%, #059669 100%)';
            case 'upcoming':
                return 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)';
            case 'ended':
                return 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
            default:
                return 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
        }
    }};
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6b7280;
`;

const ActionButton = styled(Button)`
    && {
        background: linear-gradient(135deg, #2b4c8c 0%, #1a365d 100%) !important;
        border: none !important;
        height: 40px;
        transition: all 0.3s ease;
        
        &:hover {
            opacity: 0.9;
            transform: scale(1.01);
        }
    }
`;

const TournamentTitle = styled(Title)`
    font-size: 1.5rem !important;
    font-weight: 700 !important;
    color: #1a365d !important;
    margin-bottom: 8px !important;
    
    &:after {
        content: '';
        display: block;
        width: 40px;
        height: 3px;
        background: linear-gradient(90deg, #2b4c8c 0%, #1a365d 100%);
        margin-top: 8px;
        border-radius: 2px;
    }
`;

const TournamentCard = ({ tournament }) => {
    const navigate = useNavigate();
    const truncateText = (text, limit = 50) => {
        if (!text) return '';
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return '#059669';
            case 'upcoming': return '#3b82f6';
            case 'ended': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const handleTournamentEntry = () => {
        if (tournament.status === 'active') {
            navigate(`/tournament/${tournament.id}`);
        }else{
            navigate(`/tournament/${tournament.id}`);
        }
    };

    return (
        <StyledCard
            bodyStyle={{ padding: '24px' }}
            hoverable
        >
            <StatusBadge status={tournament.status}>
                {(tournament.status || 'active').toUpperCase()}
            </StatusBadge>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                    <TournamentTitle level={4}>
                        {tournament.name}
                    </TournamentTitle>
                    <Tooltip title={tournament.description}>
                        <Text type="secondary" style={{ 
                            fontSize: '14px',
                            display: 'block',
                            marginBottom: '16px'
                        }}>
                            {truncateText(tournament.description)}
                        </Text>
                    </Tooltip>
                </div>

                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <MetaItem>
                        <TeamOutlined /> 
                        <Text>{tournament.participants} Participants</Text>
                    </MetaItem>
                    <MetaItem>
                        <ClockCircleOutlined />
                        <Text>{tournament.duration}</Text>
                    </MetaItem>
                    {tournament.progress && (
                        <Tooltip title={`${tournament.progress}% Complete`}>
                            <Progress 
                                percent={tournament.progress} 
                                showInfo={false}
                                strokeColor={getStatusColor(tournament.status || 'active')}
                                size="small"
                            />
                        </Tooltip>
                    )}
                </Space>

                <ActionButton 
                    type="primary" 
                    block
                    icon={<RightOutlined />}
                    onClick={handleTournamentEntry}
                >
                    {(tournament.status || 'active') === 'upcoming' ? 'Join Waitlist' : 'Enter Tournament'}
                </ActionButton>
            </Space>
        </StyledCard>
    );
};

export default TournamentCard;
