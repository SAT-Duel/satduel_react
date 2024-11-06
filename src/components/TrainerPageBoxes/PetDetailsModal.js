// PetDetailsModal.js

import React from 'react';
import { Modal, Button } from 'antd';
import Lottie from 'react-lottie';

const PetDetailsModal = ({
  isModalVisible,
  closePetDetails,
  pet,
  loadingUpgrade,
  handleUpgradePet,
}) => {
  if (!pet) return null;

  return (
    <Modal
      visible={isModalVisible}
      title={`${pet.name} (Level ${pet.level})`}
      onCancel={closePetDetails}
      footer={[
        <Button key="upgrade" type="primary" loading={loadingUpgrade} onClick={handleUpgradePet}>
          Upgrade Pet
        </Button>,
        <Button key="close" onClick={closePetDetails}>
          Close
        </Button>,
      ]}
    >
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: pet.animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        height={200}
        width={200}
      />
      <p>Current Level: {pet.level}</p>
      <p>Upgrade cost: {(pet.level + 1) * pet.price} coins</p>
      <p>Current Perks:</p>
      <ul>
        <li>Some perk at level {pet.level}</li>
      </ul>
    </Modal>
  );
};

export default PetDetailsModal;
