import React from 'react';
import {Link} from 'react-router-dom';
import Navbar from '../components/Navbar';

function AboutPage() {
    return (
        <div>
            <h1>About Us</h1>
            <p>Below are our team members</p>
            <ul>
                <li>Clement Zhou</li>
                <li>Alex Jin</li>
            </ul>
        </div>
    );
}

export default AboutPage;