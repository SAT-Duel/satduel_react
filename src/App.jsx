import React from 'react';
import Router from "./components/Router";
import './App.css';
import ToastHost from './components/ToastHost';
import {DesmosProvider} from './components/DesmosCalculator';
import AccountCompletionModal from './components/AccountCompletionModal';

function App() {
    return (
        <>
            <DesmosProvider>
                <Router/>
                <AccountCompletionModal/>
            </DesmosProvider>
            <ToastHost/>
        </>
    );
}

export default App;
