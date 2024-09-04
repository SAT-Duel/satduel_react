import React, {useEffect} from 'react';
import Router from "./components/Router";
import './App.css';
import {ConfigProvider} from "antd";
import enUS from 'antd/es/locale/en_US';
import api from './components/api'
import {ThemeProvider} from "styled-components";
import theme from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";


function App() {
    useEffect(() => {
        const baseUrl = process.env.REACT_APP_API_URL;
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles/>
            <ConfigProvider locale={enUS}>
                <Router/>
            </ConfigProvider>
        </ThemeProvider>
    );
}

export default App;
