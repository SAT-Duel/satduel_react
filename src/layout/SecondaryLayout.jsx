import React from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from "../components/Navbar";
import SATFooter from "../components/SATFooter";
import useSdTheme from '../hooks/useSdTheme';
import '../styles/landing.css';

// Public shell: every non-logged-in page shares the arena theme,
// the dark/light toggle, the nav, and the footer.
const SecondaryLayout = () => {
    const [theme, toggleTheme] = useSdTheme();
    return (
        <div className="sd-landing flex min-h-screen flex-col" data-theme={theme}>
            <Navbar theme={theme} onToggleTheme={toggleTheme}/>
            <main className="flex-1">
                <Outlet/>
            </main>
            <SATFooter/>
        </div>
    );
};

export default SecondaryLayout;
