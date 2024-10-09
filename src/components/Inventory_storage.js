import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 40px;
    background-color: #f0f2f5;
`;

function Storage() {
    return (
        <Container>
            <h3>Your items in storage will appear here.</h3>
        </Container>
    );
}

export default Storage;
