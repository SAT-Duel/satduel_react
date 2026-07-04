import React from 'react';
import Router from "./components/Router";
import './App.css';
import {ConfigProvider} from "antd";
import enUS from 'antd/es/locale/en_US';
import {ThemeProvider} from "styled-components";
import theme from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";

// Ant Design pages that haven't been converted to Tailwind yet inherit the
// design-system palette through these tokens, so the app looks consistent
// during the migration.
const antdTheme = {
    token: {
        colorPrimary: '#7c3aed',
        colorInfo: '#7c3aed',
        colorLink: '#7c3aed',
        borderRadius: 10,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        colorTextBase: '#1e293b',
    },
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles/>
            <ConfigProvider locale={enUS} theme={antdTheme}>
                <Router/>
            </ConfigProvider>
        </ThemeProvider>
    );
}

export default App;
