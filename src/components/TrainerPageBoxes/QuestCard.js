import React from 'react';
import {Card, Progress, Button, Typography, Space} from 'antd';
import {TrophyOutlined} from '@ant-design/icons';

const {Text} = Typography;

const QuestCard = ({quest, onClaimReward}) => {
    const formatTimeRemaining = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <Card
            size="small"
            style={{
                marginBottom: 8,
                borderRadius: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
        >
            <Space direction="vertical" style={{width: '100%'}} size="small">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text strong>
                        {quest.template.period_type === 'daily' ? 'Daily Quest' : 'Weekly Quest'}
                    </Text>
                    <Text type="secondary" style={{fontSize: '12px'}}>
                        {formatTimeRemaining(quest.time_remaining)} left
                    </Text>
                </div>

                <Text style={{fontSize: '13px'}}>
                    Complete {quest.target} questions
                </Text>

                <Progress
                    percent={quest.completion_percentage}
                    status={quest.completed ? "success" : "active"}
                    format={() => `${quest.progress}/${quest.target}`}
                    size="small"
                />

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: '13px'}}>
                        Reward: <Text strong>{quest.reward_coins} coins</Text>
                    </Text>

                    {quest.completed && !quest.reward_claimed && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<TrophyOutlined/>}
                            onClick={() => onClaimReward(quest.id)}
                        >
                            Claim
                        </Button>
                    )}
                </div>
            </Space>
        </Card>
    );
};

export default QuestCard; 