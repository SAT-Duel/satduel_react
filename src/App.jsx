import React from 'react';
import Router from "./components/Router";
import './App.css';
import {ThemeProvider} from "styled-components";
import theme from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";
import ToastHost from './components/ToastHost';
import DesmosCalculator from './components/DesmosCalculator';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles/>
            <Router/>
            <DesmosCalculator/>
            <ToastHost/>
        </ThemeProvider>
    );
}

export default App;
