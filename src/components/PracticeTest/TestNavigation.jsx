import {Button, Layout, Modal, Space, Typography} from "antd";
import {CheckOutlined, DownOutlined, LeftOutlined, RightOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useAuth} from "../../context/AuthContext";
import QuestionNavigation from "./QuestionNavigation";

const {Footer} = Layout;
const {Text} = Typography;

function TestNavigation({
                            currentQuestion,
                            totalQuestions,
                            setCurrentQuestion,
                            reviewQuestions,
                            answeredQuestions,
                            handelSubmit
                        }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {user} = useAuth();

    const footerStyles = {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        padding: '16px 24px',
        background: '#e4ebf7',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        height: '80px'
    };

    const dropdownStyles = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    const questionButtonStyles = {
        backgroundColor: '#1d2b53',  // Dark blue color
        color: 'white',
        border: 'none',
        '&:hover': {
            backgroundColor: '#2a3c70'  // Slightly lighter blue for hover
        }
    };

    return (
        <>
            <Modal
                open={isModalVisible}
                footer={null}
                closable={false}
                width={600}
                style={{top: 20}}
                maskClosable={true}
                onCancel={() => setIsModalVisible(false)}
            >
                <QuestionNavigation setIsOpen={setIsModalVisible} currentQuestion={currentQuestion}
                                    totalQuestions={totalQuestions} setCurrentQuestion={setCurrentQuestion}
                                    reviewQuestions={reviewQuestions} answeredQuestions={answeredQuestions}/>
            </Modal>
            <Footer style={footerStyles}>
                <Text strong style={{fontSize: '16px'}}>
                    {user?user.username:'Anonymous User'}
                </Text>

                {/* Center section - Question dropdown */}
                {currentQuestion <= totalQuestions &&
                    <div style={dropdownStyles}>
                        <Button
                            style={questionButtonStyles}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Question {currentQuestion} of {totalQuestions} <DownOutlined/>
                        </Button>
                    </div>
                }

                {/* Right section - Navigation buttons */}
                <Space size="middle">
                    {currentQuestion > 1 && (
                        <Button
                            size="large"
                            icon={<LeftOutlined/>}
                            style={{padding: '0 24px'}}
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                        >
                            Previous
                        </Button>
                    )}
                    {currentQuestion <= totalQuestions && (
                        <Button
                            type="primary"
                            size="large"
                            style={{padding: '0 24px'}}
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        >
                            Next <RightOutlined/>
                        </Button>
                    )}
                    {currentQuestion > totalQuestions && (
                        <Button
                            type="primary"
                            size="large"
                            style={{padding: '0 24px', background: '#52c41a'}}
                            onClick={() => handelSubmit()}
                        >
                            Submit <CheckOutlined/>
                        </Button>
                    )}
                </Space>
            </Footer>
        </>
    );
}

export default TestNavigation;