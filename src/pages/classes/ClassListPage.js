import React, {useState, useEffect} from 'react';
import {Row, Col, Button, Spin, message, Typography, Grid, Empty} from 'antd';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios';
import ClassCard from '../../components/Classes/ClassCard';
import JoinClassModal from '../../components/Classes/JoinClassModal';
import CreateClassModal from '../../components/Classes/CreateClassModal';

const {useBreakpoint} = Grid;
const {Title} = Typography;

const ClassListPage = () => {
    const {user, token} = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [newClassName, setNewClassName] = useState('');
    const [newClassDescription, setNewClassDescription] = useState('');
    const screens = useBreakpoint();

    const fetchClasses = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setClasses(response.data);
        } catch (error) {
            message.error('Failed to fetch classes');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handleJoinClass = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/classes/join/`,
                {code: classCode},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            message.success('Successfully joined class!');
            setShowJoinModal(false);
            fetchClasses();
        } catch (error) {
            message.error(error.response?.data?.detail || 'Failed to join class');
        }
    };

    const handleCreateClass = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/classes/`,
                {name: newClassName, description: newClassDescription},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            message.success('Class created successfully!');
            setShowCreateModal(false);
            fetchClasses();
        } catch (error) {
            message.error(error.response?.data?.detail || 'Failed to create class');
        }
    };

    return (
        <div className="class-list-page" style={{ 
            padding: screens.xs ? '16px 8px' : '24px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} style={{ marginBottom: 0 }}>My Classes</Title>
                </Col>
                <Col>
                    <Button.Group>
                        {user?.role === 'TEACHER' && (
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={() => setShowCreateModal(true)}
                                style={{ borderRadius: '8px' }}
                            >
                                New Class
                            </Button>
                        )}
                        <Button 
                            icon={<SearchOutlined />}
                            onClick={() => setShowJoinModal(true)}
                            style={{ borderRadius: '8px' }}
                        >
                            Join Class
                        </Button>
                    </Button.Group>
                </Col>
            </Row>

            <Spin spinning={loading} style={{ flex: 1 }}>
                {classes.length > 0 ? (
                    <Row 
                        gutter={[24, 24]} 
                        style={{ 
                            flex: 1,
                            margin: screens.xs ? '-8px' : 0,
                            justifyContent: 'flex-start'
                        }}
                    >
                        {classes.map(cls => (
                            <Col 
                                key={cls.id} 
                                xs={24} 
                                sm={12} 
                                md={8} 
                                lg={6}
                                style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center',
                                    padding: screens.xs ? '8px' : '12px'
                                }}
                            >
                                <ClassCard cls={cls} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px'
                    }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span style={{ color: '#bfbfbf' }}>
                                    {loading ? 'Loading classes...' : 'No classes found'}
                                </span>
                            }
                        />
                    </div>
                )}
            </Spin>

            <JoinClassModal
                visible={showJoinModal}
                onCancel={() => setShowJoinModal(false)}
                onOk={handleJoinClass}
                classCode={classCode}
                setClassCode={setClassCode}
            />

            {user?.role === 'TEACHER' && (
                <CreateClassModal
                    visible={showCreateModal}
                    onCancel={() => setShowCreateModal(false)}
                    onCreate={handleCreateClass}
                    className={newClassName}
                    setClassName={setNewClassName}
                    classDescription={newClassDescription}
                    setClassDescription={setNewClassDescription}
                />
            )}
        </div>
    );
};

export default ClassListPage; 