import React, {useEffect, useState} from 'react';
import {Typography, message, Empty, Spin} from 'antd';
import {useAuth} from '../../context/AuthContext';
import QuestCard from './QuestCard';
import api from "../api";

const {Title} = Typography;

const QuestsSection = () => {
    const {token} = useAuth();
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQuests = async () => {
        try {
            const response = await api.get(`api/quests/`);
            setQuests(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            message.error('Failed to load quests');
            setLoading(false);
        }
    };

    const handleClaimReward = async (questId) => {
        //TODO: After the reward is claimed, refresh the coin section (update coin). Could add some animations to make it look cool.
        try {
            await api.post(
                `api/quests/claim_reward/`,
                {quest_id: questId}
            );
            console.log(questId);
            message.success('Reward claimed successfully!');
            setQuests(quests.filter(quest => quest.id !== questId));

        } catch (error) {
            message.error('Failed to claim reward');
        }
    };

    useEffect(() => {
        if (token) {
            fetchQuests();
        }
    }, [token]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                fetchQuests();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [token]);

    return (
        <div>
            <Title level={4} style={{marginBottom: 24}}>Quests</Title>

            {loading ? (
                <div style={{textAlign: 'center', padding: '24px'}}>
                    <Spin size="small"/>
                </div>
            ) : quests.length > 0 ? (
                quests.map(quest => (
                    <QuestCard
                        key={quest.id}
                        quest={quest}
                        onClaimReward={handleClaimReward}
                    />
                ))
            ) : (
                <Empty
                    description="No active quests"
                    style={{margin: '20px 0'}}
                    imageStyle={{height: 40}}
                />
            )}
        </div>
    );
};

export default QuestsSection;