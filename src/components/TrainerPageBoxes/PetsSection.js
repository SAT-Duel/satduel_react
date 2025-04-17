// PetsSection.js

import React, {useState, useEffect} from 'react';
import {Typography, Button, message} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import PetDetailsModal from './PetDetailsModal';

const {Title, Paragraph} = Typography;

const PetSectionWrapper = styled.div`
    margin-bottom: 24px;
`;

const PetSectionContent = styled.div`
    text-align: center;
`;

const PetName = styled.h4`
    margin-top: 10px;
    color: #333;
`;

const ArrowButtonSmall = styled(Button)`
    background-color: transparent;
    border: none;
    color: #1890ff;
    font-size: 18px;
    padding: 0 8px;
`;

const PetArrowsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
`;

const PetsSection = () => {
    const {token} = useAuth();
    const [pets, setPets] = useState([]);
    const [currentPetIndex, setCurrentPetIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadingUpgrade, setLoadingUpgrade] = useState(false);

    useEffect(() => {
        const fetchPets = async () => {
            if (!token) return;

            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const petsResponse = await axios.get(`${baseUrl}/api/user_pets/`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setPets(petsResponse.data.pets);
            } catch (error) {
                message.error('Failed to load pets');
            }
        };

        fetchPets();
    }, [token]);

    const handleNextPet = () => {
        setCurrentPetIndex((prevIndex) => (prevIndex + 1) % pets.length);
    };

    const handlePrevPet = () => {
        setCurrentPetIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length);
    };

    const openPetDetails = () => {
        setIsModalVisible(true);
    };

    const closePetDetails = () => {
        setIsModalVisible(false);
    };

    const handleUpgradePet = async () => {
        const selectedPet = pets[currentPetIndex];
        if (!selectedPet) return;

        setLoadingUpgrade(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/upgrade_pet/`,
                {pet_id: selectedPet.id},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.status === 'success') {
                message.success(response.data.message);
                setPets((prevPets) =>
                    prevPets.map((pet) => (pet.id === selectedPet.id ? {...pet, level: response.data.new_level} : pet))
                );
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

    const selectedPet = pets[currentPetIndex];

    return (
        <>
            <PetSectionWrapper>
                <PetSectionContent>
                    <Title level={4}>Your Pet</Title>
                    {pets.length > 0 ? (
                        <div onClick={openPetDetails}>
                            <Lottie
                                options={{
                                    loop: true,
                                    autoplay: true,
                                    animationData: selectedPet.animationData,
                                    rendererSettings: {
                                        preserveAspectRatio: 'xMidYMid slice',
                                    },
                                }}
                                height={200}
                                width={200}
                            />
                            <PetName>{selectedPet.name}</PetName>
                            <PetArrowsContainer>
                                <ArrowButtonSmall onClick={handlePrevPet} icon={<LeftOutlined/>}/>
                                <ArrowButtonSmall onClick={handleNextPet} icon={<RightOutlined/>}/>
                            </PetArrowsContainer>
                        </div>
                    ) : (
                        <Paragraph>You don't have any pets yet.</Paragraph>
                    )}
                </PetSectionContent>
            </PetSectionWrapper>

            {/* Pet Details Modal */}
            <PetDetailsModal
                isModalVisible={isModalVisible}
                closePetDetails={closePetDetails}
                pet={selectedPet}
                loadingUpgrade={loadingUpgrade}
                handleUpgradePet={handleUpgradePet}
            />
        </>
    );
};

export default PetsSection;
