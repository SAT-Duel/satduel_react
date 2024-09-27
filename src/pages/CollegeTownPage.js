import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Text, OrbitControls, Plane } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
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

const CollegeTownMap = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <ContentWrapper>
                <h1>College Town</h1>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <Canvas 
                        style={{ width: '800px', height: '600px', border: '2px solid #ccc' }}
                        camera={{ position: [0, 5, 10], fov: 60 }}
                        background={'skyblue'}
                    >
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <OrbitControls />

                        {/* Ground (Light Green Grass) */}
                        <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} args={[30, 30]}>
                            <meshStandardMaterial color={'lightgreen'} />
                        </Plane>

                        {/* Roads */}
                        <Box position={[0, -0.49, 0]} args={[15, 0.02, 2]} rotation={[0, 0, 0]}>
                            <meshStandardMaterial color={'gray'} />
                        </Box>
                        <Box position={[0, -0.49, 3]} args={[2, 0.02, 15]} rotation={[0, 0, 0]}>
                            <meshStandardMaterial color={'gray'} />
                        </Box>

                        {/* Yellow Dotted Line */}
                        {[...Array(15)].map((_, i) => (
                            <Box key={i} position={[-7 + i, -0.45, 0]} args={[0.5, 0.01, 0.1]}>
                                <meshStandardMaterial color={'yellow'} />
                            </Box>
                        ))}

                        {/* Trees */}
                        {[...Array(6)].map((_, i) => (
                            <group key={i} position={[-7 + i * 2.5, 0, -5]}>
                                <Box position={[0, 1, 0]} args={[0.5, 2, 0.5]}>
                                    <meshStandardMaterial color={'saddlebrown'} />
                                </Box>
                                <Box position={[0, 2.75, 0]} args={[1.5, 1.5, 1.5]}>
                                    <meshStandardMaterial color={'green'} />
                                </Box>
                            </group>
                        ))}

                        {/* My House (Placed beside the road) */}
                        <Box position={[-4, 0.5, -2.5]} args={[2, 1, 2]} onClick={() => navigate('/house')}>
                            <meshStandardMaterial color={'lightblue'} />
                        </Box>
                        <Text position={[-4, 1.5, -2.5]} fontSize={0.2} color="black">
                            🏠 My House
                        </Text>

                        {/* Shop (Placed beside the road) */}
                        <Box position={[4, 0.5, -2.5]} args={[2, 1, 2]} onClick={() => navigate('/shop')}>
                            <meshStandardMaterial color={'orange'} />
                        </Box>
                        <Text position={[4, 1.5, -2.5]} fontSize={0.2} color="black">
                            🏪 Shop
                        </Text>

                    </Canvas>
                </div>
            </ContentWrapper>
        </Container>
    );
};

export default CollegeTownMap;