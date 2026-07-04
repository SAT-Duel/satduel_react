import React from 'react';
import { Modal, Input, Typography } from 'antd';
const { TextArea } = Input;

const CreateClassModal = ({ visible, onCancel, onCreate, className, setClassName, classDescription, setClassDescription }) => {
  return (
    <Modal
      title="Create New Class"
      visible={visible}
      onOk={onCreate}
      onCancel={onCancel}
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Create a new class to organize your students and assignments
      </Typography.Paragraph>
      <Input
        placeholder="Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <TextArea
        placeholder="Class Description (optional)"
        value={classDescription}
        onChange={(e) => setClassDescription(e.target.value)}
        rows={3}
      />
    </Modal>
  );
};

export default CreateClassModal; 