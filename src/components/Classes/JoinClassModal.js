import React from 'react';
import { Modal, Input, Typography } from 'antd';

const JoinClassModal = ({ visible, onCancel, onOk, classCode, setClassCode }) => {
  return (
    <Modal
      title="Join Class"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Enter the 6-digit class code provided by your teacher
      </Typography.Paragraph>
      <Input
        placeholder="Class Code"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
        maxLength={6}
        style={{ textTransform: 'uppercase' }}
      />
    </Modal>
  );
};

export default JoinClassModal; 