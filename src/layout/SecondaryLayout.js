import React from 'react';
import {Layout, theme} from 'antd';
import Navbar from "../components/Navbar";
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const SecondaryLayout = ({ children }) => {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <Layout>
            <Header className="site-layout-header">
                <Navbar />
            </Header>
            <Content style={{ padding: '0 50px', marginTop: '64px' }}>
                <Outlet />
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    );
};

export default SecondaryLayout;
