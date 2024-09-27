// src/components/CreateGameModal.js
import React from 'react';
import { Modal, Form, InputNumber, Input, message } from 'antd';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";

function CreateGameModal({ visible, onClose, onGameCreated }) {
  const [form] = Form.useForm();
  const {token} = useAuth();

  const handleCreateGame = values => {
    const baseUrl = process.env.REACT_APP_API_URL;
    axios.post(`${baseUrl}/api/games/create/`, values, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
      .then(response => {
        message.success('Game created successfully!');
        onGameCreated(response.data.game_id);
      })
      .catch(error => {
        message.error('Failed to create game.'+error);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Create Game"
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            handleCreateGame(values);
            form.resetFields();
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="max_players" label="Max Players" initialValue={2}>
          <InputNumber min={2} max={10} />
        </Form.Item>
        <Form.Item name="question_number" label="Number of Questions" initialValue={10}>
          <InputNumber min={1} max={100} />
        </Form.Item>
        <Form.Item name="battle_duration" label="Battle Duration (seconds)" initialValue={600}>
          <InputNumber min={60} max={3600} />
        </Form.Item>
        <Form.Item name="password" label="Password (optional)">
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateGameModal;
