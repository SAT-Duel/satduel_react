import React, { useState } from 'react';
import { Typography, Button, Row, Col, message, List } from 'antd';
import Lottie from 'react-lottie';
import axios from 'axios';  
import { useAuth } from "../context/AuthContext";
import styled from 'styled-components';
import pet1AnimationData from '../animations/pets/pet1.json';
import pet2AnimationData from '../animations/pets/pet2.json';
import lootbox1AnimationData from '../animations/lootbox.json';

const { Title, Text } = Typography;

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

const MainHeader = styled(Title)`
    font-size: 3.5rem;
    color: #0B2F7D;
    margin-bottom: 20px;
    text-align: center;
    background: linear-gradient(90deg, #2B7FA3, #C95FFB);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const SubHeader = styled(Title)`
    font-size: 2.5rem;
    color: #4C3D97;
    margin-bottom: 40px;
    text-align: center;
    background: linear-gradient(90deg, #6a11cb, #2575fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
`;

const PetItem = styled.div`
    text-align: center;
    cursor: pointer;
    padding: 20px;
    border-radius: 15px;
    background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
    }
`;

const PetPriceButton = styled(Button)`
    margin-top: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        color: white;
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
`;

const Popup = styled.div`
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease-in-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
`;

const CloseButton = styled(Button)`
    background-color: #f44336;
    border: none;
    color: white;
    font-weight: bold;
    margin-top: 20px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #d32f2f;
    }
`;

const defaultOptions = (animationData) => ({
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
});

const Shop = () => {
    const [selectedPet, setSelectedPet] = useState(null);
    const { token } = useAuth();

    const pets = [
        {
            id: 1,
            name: 'Gaming Cat',
            price: 25,
            description: 'Level 1 Base Perks:',
            benefits: ['Permanent 1% Coin Multiplier', 'Unlocks the ability to find gaming treasures in SAT Alcumus'],
            animationData: pet1AnimationData,
        },
        {
            id: 34,
            name: 'Bessie The Cow',
            price: 250,
            description: 'Level 1 Base Perks:',
            benefits: ['Permanent 50% Coin Multiplier', 'MILK?!'],
            animationData: pet2AnimationData,
        },
    ];

    const handlePetBuy = async (id) => {
        try {
            const payload = {
                id: id
            };
            const baseUrl = process.env.REACT_APP_API_URL; // Assuming you have this set in your environment
            console.log(baseUrl);
            console.log(token);
            const response = await axios.post(`${baseUrl}/api/buy_pet/`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = response.data;

            if (response.status === 200) {
                if (result.purchased) {
                    message.success(result.message);
                } else {
                    message.error(result.message);
                }
            } else {
                message.error(result.error || 'Purchase failed.');
            }
        } catch (error) {
            console.error('Error purchasing pet:', error);
            message.error('Purchase failed.');
        }
    };

    const openPetDetails = (pet) => {
        setSelectedPet(pet);
    };

    const closePetDetails = () => {
        setSelectedPet(null);
    };

    return (
        <Container>
            <ContentWrapper>
                <MainHeader>Coin Shop</MainHeader>
                <SubHeader>Pets</SubHeader>
                <Row gutter={[24, 24]}>
                    {pets.map((pet) => (
                        <Col key={pet.id} xs={24} sm={12} md={8}>
                            <PetItem onClick={() => openPetDetails(pet)}>
                                <Lottie options={defaultOptions(pet.animationData)} height={150} width={150} />
                                <PetPriceButton onClick={(e) => {
                                    e.stopPropagation();
                                    handlePetBuy(pet.id);
                                }}>
                                    {pet.price} Coins
                                </PetPriceButton>
                            </PetItem>
                        </Col>
                    ))}
                </Row>
                {selectedPet && (
                    <Overlay onClick={closePetDetails}>
                        <Popup onClick={(e) => e.stopPropagation()}>
                            <Title level={2}>{selectedPet.name}</Title>
                            <Text>{selectedPet.description}</Text>
                            <List
                                dataSource={selectedPet.benefits}
                                renderItem={item => <List.Item>- {item}</List.Item>}
                            />
                            <CloseButton onClick={closePetDetails}>OK</CloseButton>
                        </Popup>
                    </Overlay>
                )}
            </ContentWrapper>
        </Container>
    );
};

export default Shop;