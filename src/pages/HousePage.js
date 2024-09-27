import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Text, OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { message } from 'antd';
import { useAuth } from "../context/AuthContext";
import styled from 'styled-components';

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #F5F7FF 0%, #E8EEFF 100%);
    padding: 60px 20px;
`;

const ContentWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
`;

const HouseMap = () => {
    const { token } = useAuth();

    useEffect(() => {
        const fetchHouseData = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                await axios.get(`${baseUrl}/api/house/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

            } catch (error) {
                console.error('Error fetching house map:', error);
                message.error('Failed to load house data. Please try again later.');
            }
        };

        if (token) {
            fetchHouseData();
        }
    }, [token]);

    return (
        <Container>
            <ContentWrapper>
                <h1>Your House</h1>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <Canvas style={{ width: '800px', height: '600px', border: '2px solid #ccc', backgroundColor: '#e8eeff' }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <OrbitControls />

                        {/* Living Room */}
                        <Box position={[-2, 0.5, 0]} args={[4, 1, 4]} onClick={() => alert('Living Room')}>
                            <meshStandardMaterial color={'lightblue'} />
                            <Text position={[0, 1, 0]} fontSize={0.3} color="black">
                                🛋️
                            </Text>
                            <Text position={[0, 0.6, 0]} fontSize={0.2} color="black">
                                Living Room
                            </Text>
                        </Box>

                        {/* Bedroom */}
                        <Box position={[2, 0.5, 0]} args={[4, 1, 4]} onClick={() => alert('Bedroom')}>
                            <meshStandardMaterial color={'lightgreen'} />
                            <Text position={[0, 1, 0]} fontSize={0.3} color="black">
                                🛏️
                            </Text>
                            <Text position={[0, 0.6, 0]} fontSize={0.2} color="black">
                                Bedroom
                            </Text>
                        </Box>

                        {/* Washroom */}
                        <Box position={[0, 0.5, -4]} args={[4, 1, 4]} onClick={() => alert('Washroom')}>
                            <meshStandardMaterial color={'lightcoral'} />
                            <Text position={[0, 1, 0]} fontSize={0.3} color="black">
                                🚽
                            </Text>
                            <Text position={[0, 0.6, 0]} fontSize={0.2} color="black">
                                Washroom
                            </Text>
                        </Box>
                    </Canvas>
                </div>
            </ContentWrapper>
        </Container>
    );
};

export default HouseMap;
