import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import QuestionsPage from "./pages/QuestionPage";
// import ContactPage from './pages/ContactPage';
// import PracticePage from './pages/PracticePage';
// import MockTestPage from './pages/MockTestPage';
// import ReviewPage from './pages/ReviewPage';
import Navbar from './components/Navbar';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import Match from "./pages/MatchingPage";
import DuelBattle from "./pages/DuelBattlePage";
import './App.css';

function App() {
    const [RoomId, setRoomId] = useState(null)
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
                {/*<Route path="/contact" element={<ContactPage />} />*/}
                {/*<Route path="/practice" element={<PracticePage />} />*/}
                {/*<Route path="/mock-test" element={<MockTestPage />} />*/}
                {/*<Route path="/review" element={<ReviewPage />} />*/}
            </Routes>
        </Router>
    );
}

export default App;
