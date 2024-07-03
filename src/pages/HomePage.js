import React from 'react';
import {Link} from 'react-router-dom';
import Navbar from '../components/Navbar';

function HomePage() {
    return (
        <div>
            <h1>Welcome to the SAT Practice Website!</h1>
            <p>Enhance your SAT skills with our tailored practice sessions and mock tests.</p>
            <div>
                <Link to="/questions">
                    <button>Start Practice</button>
                </Link>
                <Link to="/match">
                    <button>Start Duel</button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;