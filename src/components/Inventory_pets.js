import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import axios from 'axios';
import { Modal, Button, message } from 'antd';
import { useAuth } from "../context/AuthContext";

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 40px;
    background-color: #f0f2f5;
`;

const PetCard = styled.div`
    margin: 20px;
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;

    &:hover {
        transform: translateY(-10px) scale(1.05);
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
    }
`;

const PetName = styled.h3`
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 10px;
`;

const defaultOptions = (animationData) => ({
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
});

function Pets() {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadingUpgrade, setLoadingUpgrade] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${baseUrl}/api/user_pets/`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setPets(response.data.pets);
            } catch (error) {
                console.error('Error fetching pets:', error);
                message.error('Failed to load your pets.');
            }
        };

        fetchPets();
    }, [token]);

    const openPetDetails = (pet) => {
        setSelectedPet(pet);
        setIsModalVisible(true);
    };

    const closePetDetails = () => {
        setSelectedPet(null);
        setIsModalVisible(false);
    };

    const handleUpgradePet = async () => {
        if (!selectedPet) return;

        setLoadingUpgrade(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/upgrade_pet/`,
                { pet_id: selectedPet.id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if (response.data.status === 'success') {
                message.success(response.data.message);
                setSelectedPet({ ...selectedPet, level: response.data.new_level });
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error('Error upgrading pet:', error);
            message.error('Failed to upgrade pet.');
        } finally {
            setLoadingUpgrade(false);
        }
    };

    return (
        <Container>
            {pets.length > 0 ? (
                pets.map((pet) => (
                    <PetCard key={pet.id} onClick={() => openPetDetails(pet)}>
                        <Lottie options={defaultOptions(pet.animationData)} height={150} width={150} />
                        <PetName>{pet.name}</PetName>
                    </PetCard>
                ))
            ) : (
                <h3>You do not own any pets yet!</h3>
            )}

            {selectedPet && (
                <Modal
                    visible={isModalVisible}
                    title={`${selectedPet.name} (Level ${selectedPet.level})`}
                    onCancel={closePetDetails}
                    footer={[
                        <Button key="upgrade" type="primary" loading={loadingUpgrade} onClick={handleUpgradePet}>
                            Upgrade Pet
                        </Button>,
                        <Button key="close" onClick={closePetDetails}>Close</Button>,
                    ]}
                >
                    <Lottie options={defaultOptions(selectedPet.animationData)} height={200} width={200} />
                    <p>Current Level: {selectedPet.level}</p>
                    <p>Upgrade cost: {(selectedPet.level + 1) * selectedPet.price} coins</p>
                    <p>Current Perks:</p>
                    <ul>
                        <li>Some perk at level {selectedPet.level}</li>
                        {/* Add more perks as needed */}
                    </ul>
                </Modal>
            )}
        </Container>
    );
}

export default Pets;
