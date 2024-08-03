import React from 'react';
import Router from "./components/Router";
import './App.css';
import {ConfigProvider} from "antd";
import enUS from 'antd/es/locale/en_US';


function App() {
    return (
        <ConfigProvider locale={enUS}>
            <Router/>
        </ConfigProvider>
    );
}

export default App;
