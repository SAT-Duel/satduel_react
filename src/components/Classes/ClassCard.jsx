import React from 'react';
import {Card, Button, Avatar, Tag} from 'antd';
import {Link} from 'react-router-dom';

const {Meta} = Card;

const ClassCard = ({cls}) => {
    return (
        <Card
            style={{
                width: '100%',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                height: '100%',
                ':hover': {
                    transform: 'translateY(-4px)'
                }
            }}
            actions={[
                <Button type="link" key="view">
                    <Link to={`/classes/${cls.id}`}>Enter Class</Link>
                </Button>
            ]}
        >
            <Meta
                avatar={<Avatar
                    size={48}
                    style={{
                        backgroundColor: '#1890ff',
                        fontSize: '20px',
                        fontWeight: 600
                    }}
                >
                    {cls.name[0]}
                </Avatar>}
                title={<span style={{fontSize: '18px', fontWeight: 600}}>{cls.name}</span>}
                description={
                    <>
                        <div style={{
                            margin: '8px 0',
                            color: '#595959',
                            minHeight: '40px'
                        }}>
                            {cls.description || 'No description'}
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Tag color="blue" style={{borderRadius: '6px'}}>
                                Code: {cls.code}
                            </Tag>
                            <Button
                                type="primary"
                                shape="round"
                                size="small"
                            >
                                Enter
                            </Button>
                        </div>
                    </>
                }
            />
        </Card>
    );
};

export default ClassCard; 