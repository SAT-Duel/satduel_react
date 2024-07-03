import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import QuestionsPage from "../pages/QuestionPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import Match from "../pages/MatchingPage";
import DuelBattle from "../pages/DuelBattlePage";

function Config({setRoomId, RoomId}) {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/questions" element={<QuestionsPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/match" element={<Match setRoomId={setRoomId}/>}/>
                <Route path="/duel_battle/:roomId" element={<DuelBattle/>}/>
            </Routes>
        </Router>
    );
}

export default Config;
