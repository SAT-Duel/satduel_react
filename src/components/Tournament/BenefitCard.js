import React from 'react';
import {Card, Typography} from 'antd';
import styled from 'styled-components';

const {Title, Paragraph} = Typography;

const StyledCard = styled(Card)`
    height: 100%;
    text-align: center;
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s;
    background: ${(props) => props.gradient};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
    }
`;

const IconWrapper = styled.div`
    font-size: 48px;
    margin-bottom: 20px;
    color: ${(props) => props.color || 'white'};
`;

const BenefitCard = ({benefit}) => (
    <StyledCard gradient={benefit.gradient}>
        <IconWrapper>{benefit.icon}</IconWrapper>
        <Title level={4} style={{color: 'white'}}>
            {benefit.title}
        </Title>
        <Paragraph style={{color: 'rgba(255,255,255,0.9)'}}>
            {benefit.description}
        </Paragraph>
    </StyledCard>
);

export default BenefitCard;
