import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {CheckOutlined, CloseOutlined, MinusOutlined} from '@ant-design/icons';

const LeaderboardContainer = styled.div`
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-top: 16px;
    overflow-y: auto;
    max-height: 60vh;
`;

const LeaderboardTitle = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 16px;
    color: #1a1a1a;
`;

const LeaderboardTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const LeaderboardHeader = styled.th`
    text-align: left;
    padding: 8px;
    border-bottom: 2px solid #eaeaea;
`;

const LeaderboardCell = styled.td`
    padding: 8px;
    border-bottom: 1px solid #eaeaea;
    vertical-align: top;
`;

const Username = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
`;

const QuestionStatus = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
`;

const StatusIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    color: #fff;
`;

const getStatusColor = (status) => {
    switch (status) {
        case 'Correct':
            return '#52c41a';
        case 'Incorrect':
            return '#f5222d';
        default:
            return '#8c8c8c';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Correct':
            return <CheckOutlined/>;
        case 'Incorrect':
            return <CloseOutlined/>;
        default:
            return <MinusOutlined/>;
    }
};

const Leaderboard = ({leaderboardData, tournamentStartTime}) => {
    const [currentDuration, setCurrentDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const start = new Date(tournamentStartTime);
            const duration = Math.floor((now - start) / 1000);
            setCurrentDuration(duration);
        }, 1000);

        return () => clearInterval(timer);
    }, [tournamentStartTime]);

    const getQuestionStatus = (question, currentDuration) => {
        if (!question.time_taken) return 'Blank';
        const [hours, minutes, seconds] = question.time_taken.split(':');
        const questionDuration =
            parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
        return questionDuration <= currentDuration ? question.status : 'Blank';
    };

    const calculateScore = (participant, currentDuration) => {
        return participant.tournament_questions.reduce((score, question) => {
            const status = getQuestionStatus(question, currentDuration);
            return status === 'Correct' ? score + 1 : score;
        }, 0);
    };

    const convertDurationToSeconds = (duration) => {
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const getLastCorrectSubmission = (participant, currentDuration) => {
        const correctQuestions = participant.tournament_questions.filter(
            (question) => getQuestionStatus(question, currentDuration) === 'Correct'
        );
        if (correctQuestions.length === 0) return Infinity;
        return Math.max(
            ...correctQuestions.map((question) => convertDurationToSeconds(question.time_taken))
        );
    };

    const sortedLeaderboard = [...leaderboardData].sort((a, b) => {
        const scoreA = calculateScore(a, currentDuration);
        const scoreB = calculateScore(b, currentDuration);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return getLastCorrectSubmission(a, currentDuration) - getLastCorrectSubmission(b, currentDuration);
    });

    return (
        <LeaderboardContainer>
            <LeaderboardTitle>Leaderboard</LeaderboardTitle>
            <LeaderboardTable>
                <thead>
                <tr>
                    <LeaderboardHeader>Rank</LeaderboardHeader>
                    <LeaderboardHeader>User</LeaderboardHeader>
                    <LeaderboardHeader>Score</LeaderboardHeader>
                </tr>
                </thead>
                <tbody>
                {sortedLeaderboard.map((participant, index) => {
                    const currentScore = calculateScore(participant, currentDuration);
                    return (
                        <tr key={participant.user.id}>
                            <LeaderboardCell>{index + 1}</LeaderboardCell>
                            <LeaderboardCell>
                                <Username>{participant.user.username}</Username>
                                <QuestionStatus>
                                    {participant.tournament_questions.map((question, qIndex) => {
                                        const status = getQuestionStatus(question, currentDuration);
                                        return (
                                            <StatusIcon
                                                key={qIndex}
                                                style={{backgroundColor: getStatusColor(status)}}
                                            >
                                                {getStatusIcon(status)}
                                            </StatusIcon>
                                        );
                                    })}
                                </QuestionStatus>
                            </LeaderboardCell>
                            <LeaderboardCell>{currentScore}</LeaderboardCell>
                        </tr>
                    );
                })}
                </tbody>
            </LeaderboardTable>
        </LeaderboardContainer>
    );
};

export default Leaderboard;
