import React, {useEffect} from 'react';
import Router from "./components/Router";
import './App.css';
import {ConfigProvider} from "antd";
import enUS from 'antd/es/locale/en_US';
import {ThemeProvider} from "styled-components";
import theme from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";
import {useLocation} from "react-router-dom";

// Google Analytics Page View Tracking Function
const usePageTracking = () => {
    const location = useLocation();
    useEffect(() => {
        // Send a page view event to Google Analytics on route change
        window.gtag('config', 'G-GFCQENJHVP', {
            page_path: location.pathname + location.search,
        });
    }, [location]);
};
function App() {
    usePageTracking();
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
