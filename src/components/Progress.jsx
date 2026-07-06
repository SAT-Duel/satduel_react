import React from 'react';
import styled from 'styled-components';
import {Check, Minus, X} from 'lucide-react';

const StatusWrapper = styled.div`
    display: flex;
    align-items: center;
    font-size: ${(props) => (props.isMobile ? '1rem' : '0.9rem')};
    color: #555;
    margin-bottom: 8px;
`;

const StatusIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => (props.isMobile ? '24px' : '18px')};
    height: ${(props) => (props.isMobile ? '24px' : '18px')};
    border-radius: 50%;
    margin-right: 8px;
    color: #fff;
    font-size: ${(props) => (props.isMobile ? '1rem' : '0.8rem')};
`;

const StatusText = styled.span`
    font-weight: 500;
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
            return <Check size={14}/>;
        case 'Incorrect':
            return <X size={14}/>;
        default:
            return <Minus size={14}/>;
    }
};

function Progress({status, questionNumber, isMobile = false}) {
    return (
        <StatusWrapper isMobile={isMobile}>
            <StatusIcon style={{backgroundColor: getStatusColor(status)}} isMobile={isMobile}>
                {getStatusIcon(status)}
            </StatusIcon>
            <StatusText>
                Question {questionNumber}: {status}
            </StatusText>
        </StatusWrapper>
    );
}

export default Progress;
