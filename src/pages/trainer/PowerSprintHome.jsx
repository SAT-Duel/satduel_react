import React, { useState } from 'react';
import { Form, Input, Select, Button, Typography } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const PowerSprintHomeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
`;

const FormContainer = styled.div`
    background-color: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
`;

const StyledForm = styled(Form)`
    .ant-form-item {
        margin-bottom: 24px;
    }
`;

const TimerGroup = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`;

const TimerButton = styled(Button)`
    margin: 5px;
    width: calc(50% - 10px);
`;

function PowerSprintHome() {
    const [difficulty, setDifficulty] = useState('medium');
    const [timerSetting, setTimerSetting] = useState('rapid');
    const [customMinutes, setCustomMinutes] = useState(5);
    const [customSeconds, setCustomSeconds] = useState(0);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const gameSettings = {
            difficulty,
            timer: timerSetting === 'custom'
                ? customMinutes * 60 + customSeconds
                : getPresetTime(timerSetting),
        };
        navigate('/power_sprint', { state: { gameSettings } });
    };

    const getPresetTime = (preset) => {
        switch (preset) {
            case 'bullet': return 60;
            case 'blitz': return 180;
            case 'rapid': return 300;
            case 'marathon': return 600;
            default: return 300;
        }
    };

    return (
        <PowerSprintHomeContainer>
            <FormContainer>
                <Title level={2} style={{color: '#4b0082', marginBottom: '30px', textAlign: 'center'}}>
                    PowerSprint Settings
                </Title>
                <h1 style={{color: 'red', textAlign: 'center'}}>This feature is still under development (Very bad user experience).</h1>
                <h2 style={{textAlign: 'center'}}>I don't mind you try it though.</h2>
                <StyledForm onFinish={handleSubmit} layout="vertical">
                    <Form.Item label="Difficulty" name="difficulty">
                        <Select
                            value={difficulty}
                            onChange={setDifficulty}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="1">Easy</Select.Option>
                            <Select.Option value="3">Medium</Select.Option>
                            <Select.Option value="5">Hard</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Timer Setting" name="timerSetting">
                        <TimerGroup>
                            <TimerButton
                                type={timerSetting === 'bullet' ? 'primary' : 'default'}
                                onClick={() => setTimerSetting('bullet')}
                            >
                                Bullet (1 min)
                            </TimerButton>
                            <TimerButton
                                type={timerSetting === 'blitz' ? 'primary' : 'default'}
                                onClick={() => setTimerSetting('blitz')}
                            >
                                Blitz (3 min)
                            </TimerButton>
                            <TimerButton
                                type={timerSetting === 'rapid' ? 'primary' : 'default'}
                                onClick={() => setTimerSetting('rapid')}
                            >
                                Rapid (5 min)
                            </TimerButton>
                            <TimerButton
                                type={timerSetting === 'marathon' ? 'primary' : 'default'}
                                onClick={() => setTimerSetting('marathon')}
                            >
                                Marathon (10 min)
                            </TimerButton>
                            <TimerButton
                                type={timerSetting === 'custom' ? 'primary' : 'default'}
                                onClick={() => setTimerSetting('custom')}
                            >
                                Custom
                            </TimerButton>
                        </TimerGroup>
                    </Form.Item>

                    {timerSetting === 'custom' && (
                        <Form.Item label="Custom Time">
                            <TimerGroup>
                                <Input
                                    type="number"
                                    value={customMinutes}
                                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                                    min="0"
                                    max="59"
                                    style={{ width: '100px' }}
                                    addonAfter="min"
                                />
                                <Input
                                    type="number"
                                    value={customSeconds}
                                    onChange={(e) => setCustomSeconds(Number(e.target.value))}
                                    min="0"
                                    max="59"
                                    style={{ width: '100px' }}
                                    addonAfter="sec"
                                />
                            </TimerGroup>
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} onClick={handleSubmit}>
                            Start Game
                        </Button>
                    </Form.Item>
                </StyledForm>
            </FormContainer>
        </PowerSprintHomeContainer>
    );
}

export default PowerSprintHome;