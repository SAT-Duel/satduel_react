import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import Progress from '../components/Progress';
import styled, {keyframes} from 'styled-components';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const slideIn = keyframes`
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

const PageBackground = styled.div`
    min-height: 100vh;
    background: #f5f7fa;
    padding: 40px 20px;
`;

const ResultPageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.h1`
    font-size: 2.5rem;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    padding: 24px;
    background: #ecf0f1;
`;

const WinnerSection = styled.div`
    background: #3498db;
    padding: 16px;
    text-align: center;
`;

const WinnerText = styled.h2`
    font-size: 2rem;
    color: white;
    margin: 0;
`;

const ResultsContainer = styled.div`
    display: flex;
    padding: 24px;
    gap: 24px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const PlayerResultSection = styled.div`
    flex: 1;
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    animation: ${slideIn} 0.5s ease-out;
`;

const PlayerName = styled.h2`
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 16px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 8px;
`;

const ScoreSection = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 1.2rem;
    background: #ecf0f1;
    padding: 12px;
    border-radius: 6px;
`;

const ProgressContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const ProgressRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const QuestionText = styled.span`
    flex: 1;
    font-size: 0.9rem;
    color: #34495e;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
    padding-bottom: 24px;
`;

const Button = styled.button`
    padding: 12px 24px;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const HomeButton = styled(Button)`
    background-color: #2ecc71;
    color: white;

    &:hover {
        background-color: #27ae60;
    }
`;

const PlayAgainButton = styled(Button)`
    background-color: #3498db;
    color: white;

    &:hover {
        background-color: #2980b9;
    }
`;
//TODO: Put the functions/function calls and calculations into a useEffect hook
function BattleResultPage() {
    const {roomId} = useParams();
    const {loading} = useAuth();
    const [results, setResults] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.post(`${baseUrl}/api/match/get_results/`, {
                    room_id: roomId,
                });
                setResults(response.data);
            } catch (err) {
                console.error('Error fetching results:', err);
            }
        };

        if (!loading) {
            fetchResults();
        }
    }, [roomId, loading]);

    if (!results) {
        return <PageBackground><ResultPageContainer>Loading...</ResultPageContainer></PageBackground>;
    }

    const calculateScore = (userResults) => {
        return userResults.filter(result => result.status === 'Correct').length;
    };

    const user1Score = calculateScore(results.user1_results);
    const user2Score = calculateScore(results.user2_results);
    const winner = user1Score > user2Score ? results.user1_results[0].user.username :
        user2Score > user1Score ? results.user2_results[0].user.username : 'Tie';

    const setWinner = async (winner) => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(`${baseUrl}/api/match/set_winner/`, {
                room_id: roomId,
                winner: winner
            });
        } catch (err) {
            console.error('Error setting winner:', err);
        }
    };

    const setScore = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            await axios.post(`${baseUrl}/api/match/set_score/`, {
                room_id: roomId,
                user1_score: user1Score,
                user2_score: user2Score,
            });
        } catch (err) {
            console.error('Error setting score:', err);
        }
    };

    setScore();
    setWinner(winner);

    return (
        <PageBackground>
            <ResultPageContainer>
                <Header>Battle Results</Header>
                <WinnerSection>
                    <WinnerText>
                        {winner === 'Tie' ? "It's a Tie!" : `The winner is: ${winner}`}
                    </WinnerText>
                </WinnerSection>
                <ResultsContainer>
                    {[results.user1_results, results.user2_results].map((userResults, index) => (
                        <PlayerResultSection key={index}>
                            <PlayerName>{userResults[0].user.username}</PlayerName>
                            <ScoreSection>
                                <span>Correct Answers:</span>
                                <span>{calculateScore(userResults)} / {userResults.length}</span>
                            </ScoreSection>
                            <ProgressContainer>
                                {userResults.map((result, i) => (
                                    <ProgressRow key={result.id}>
                                        <Progress
                                            status={result.status}
                                            questionNumber={i + 1}
                                        />
                                        <QuestionText>{result.question_text}</QuestionText>
                                    </ProgressRow>
                                ))}
                            </ProgressContainer>
                        </PlayerResultSection>
                    ))}
                </ResultsContainer>
                <ButtonContainer>
                    <HomeButton onClick={() => navigate('/')}>Return to Homepage</HomeButton>
                    <PlayAgainButton onClick={() => navigate('/match')}>Play Again</PlayAgainButton>
                </ButtonContainer>
            </ResultPageContainer>
        </PageBackground>
    );
}

export default BattleResultPage;
