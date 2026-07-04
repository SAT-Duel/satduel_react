import React from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from "../components/Navbar";
import SATFooter from "../components/SATFooter";

const SecondaryLayout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar/>
            <main className="flex-1">
                <Outlet/>
            </main>
            <SATFooter/>
        </div>
    );
};

export default SecondaryLayout;
