import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';

const InfoSection = styled(Card)`
  margin-top: 16px;
`;

const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a1a1a;
  text-align: center;
  margin-top: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: #1a1a1a;
`;

const TournamentInfo = ({ participantInfo, timeLeft }) => {
  return (
    <InfoSection>
      <SectionTitle>Tournament Info</SectionTitle>
      {participantInfo && (
        <>
          <p>
            <b>Name:</b> {participantInfo.tournament.name}
          </p>
          <p>
            <b>Questions:</b> {participantInfo.tournament.questionNumber}
          </p>
          <p>
            <b>Participants:</b> {participantInfo.tournament.participantNumber}
          </p>
        </>
      )}
      <SectionTitle>Time Left</SectionTitle>
      <TimeDisplay>{timeLeft}</TimeDisplay>
    </InfoSection>
  );
};

export default TournamentInfo;
