import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import QuestionsPage from "../pages/QuestionPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import Match from "../pages/MatchingPage";
import DuelBattle from "../pages/DuelBattlePage";
import FriendRequestPage from "../pages/FriendRequestPage";
import MainLayout from "../layout/MainLayout";
import SecondaryLayout from "../layout/SecondaryLayout";

function Router({setRoomId, RoomId}) {
    return (
        <Routes>
            {/* Routes using MainLayout */}
            <Route element={<MainLayout/>}>
                <Route path="/questions" element={<QuestionsPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/profile/:userId" element={<ProfilePage/>}/>
                <Route path="/duel_battle/:roomId" element={<DuelBattle/>}/>
                <Route path="/friend_requests" element={<FriendRequestPage/>}/>
            </Route>

            {/* Routes using SecondaryLayout */}
            <Route element={<SecondaryLayout/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/match" element={<Match setRoomId={setRoomId}/>}/>
            </Route>
        </Routes>
    );
}

export default Router;
