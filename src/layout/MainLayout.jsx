import React from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from '../components/Navbar';
import SATFooter from '../components/SATFooter';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar/>
            <main className="flex-1">
                <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
                    <Outlet/>
                </div>
            </main>
            <SATFooter/>
        </div>
    );
};

export default MainLayout;
