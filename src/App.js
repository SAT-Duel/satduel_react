import React, {useState} from 'react';
import Router from "./components/Router";
import './App.css';
import Navbar from "./components/Navbar";
import {Layout, theme} from 'antd';

function App() {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const {Header, Content, Footer} = Layout;
    return (
        <Router />
    );
}

export default App;
