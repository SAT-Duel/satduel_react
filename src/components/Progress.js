import React from 'react';
import styled from 'styled-components';
import {CheckOutlined, CloseOutlined, MinusOutlined} from '@ant-design/icons';

const StatusWrapper = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #555;
`;

const OpponentProgress = styled.div`
    margin-top: 15px;
`;

const StatusIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-right: 5px;
    color: #fff;
`;

const StatusText = styled.span`
    font-weight: 500;
    margin-right: 10px;
`;

const getStatusColor = (status) => {
    switch (status) {
        case 'Correct':
            return '#7cb305';
        case 'Incorrect':
            return '#cf1322';
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

function Progress({status, currentQuestion, totalQuestions, opponentProgress, questionNumber}) {

    return (
        <OpponentProgress>
            <StatusWrapper>
                <StatusText>Question: {questionNumber}:</StatusText>
                <StatusIcon style={{backgroundColor: getStatusColor(status)}}>
                    {getStatusIcon(status)}
                </StatusIcon>
                <StatusText>{status}</StatusText>
            </StatusWrapper>
        </OpponentProgress>
    );
}

export default Progress;