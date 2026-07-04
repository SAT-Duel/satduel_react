import React from 'react';
import {Layout} from 'antd';
import Navbar from "../components/Navbar";
import { Outlet } from 'react-router-dom';
import SATFooter from "../components/SATFooter";

const { Header, Content } = Layout;

const SecondaryLayout = () => {
    return (
        <Layout>
            <Header className="site-layout-header">
                <Navbar />
            </Header>
            <Content>
                <Outlet />
            </Content>
            <SATFooter />
        </Layout>
    );
};

export default SecondaryLayout;
