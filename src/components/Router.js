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
import BattleResultPage from "../pages/BattleResultPage";
import MatchLoadingPage from "../pages/MatchLoadingPage";
import TrainerPage from "../pages/TrainerPage";
import InfiniteQuestionPage from "../pages/InfiniteQuestionPage";
import ConfirmEmail from "./ConfirmEmail";
import EmailVerificationPage from "../pages/EmailVerificationPage";
import PowerSprintHome from "../pages/PowerSprintHome";
import PowerSprintPage from "../pages/PowerSprintPage";
import SATSurvivalHomepage from "../pages/SATSurvivalHomepage";
import SATSurvivalPage from "../pages/SATSurvivalPage";
import TournamentPage from "../pages/TournamentPage";
import RankingPage from "../pages/RankingPage";
import TournamentListPage from "../pages/TournamentListPage";
import TournamentDetailPage from "../pages/TournamentDetailPage";
import TournamentQuestionPage from "../pages/TournamentQuestionPage";
import CreateTournamentPage from "../pages/CreateTournamentPage";
import BotTrainingPage from "../pages/BotTrainingPage";
import BotGamePage from "../pages/BotGamePage";
import PasswordResetPage from "../pages/PasswordResetPage";
import PasswordResetConfirmPage from "../pages/PasswordResetConfirmPage";
import AdminHomepage from "../pages/admin/AdminHomepage";
import QuestionListPage from "../pages/admin/QuestionListPage";
import QuestionEditorPage from "../pages/admin/QuestionEditorPage";

function Router() {
    return (
        <Routes>
            {/* Routes using MainLayout */}
            <Route element={<MainLayout/>}>
                <Route path="/questions" element={<QuestionsPage/>}/>
                <Route path="/friend_requests" element={<FriendRequestPage/>}/>
            </Route>

            {/* Routes using SecondaryLayout */}
            <Route element={<SecondaryLayout/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/confirm-email/:key" element={<ConfirmEmail/>}/>
                <Route path="/email_verification" element={<EmailVerificationPage/>}/>
                <Route path="/password_reset" element={<PasswordResetPage/>}/>
                <Route path="/api/reset/:uidb64/:token" element={<PasswordResetConfirmPage/>}/>


                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/match" element={<Match/>}/>
                <Route path="/duel_battle/:roomId" element={<DuelBattle/>}/>
                <Route path="/battle_result/:roomId" element={<BattleResultPage/>}/>
                <Route path="/match-loading/:roomId" element={<MatchLoadingPage/>}/>
                <Route path="/trainer" element={<TrainerPage/>}/>
                <Route path="/infinite_questions" element={<InfiniteQuestionPage/>}/>
                <Route path="/power_sprint_home" element={<PowerSprintHome/>}/>
                <Route path="/power_sprint" element={<PowerSprintPage/>}/>
                <Route path="/sat_survival_home" element={<SATSurvivalHomepage/>}/>
                <Route path="/sat_survival" element={<SATSurvivalPage/>}/>
                <Route path="/tournament" element={<TournamentPage/>}/>
                <Route path="/ranking" element={<RankingPage/>}/>
                <Route path="/bot_training" element={<BotTrainingPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/profile/:userId" element={<ProfilePage/>}/>
                <Route path="/bot_training/start" element={<BotGamePage/>}/>
                <Route path="/tournaments" element={<TournamentListPage/>}/>
                <Route path="/tournament/:tournamentId" element={<TournamentDetailPage/>}/>
                <Route path="/tournament/:tournamentId/questions" element={<TournamentQuestionPage/>}/>
                <Route path="/create_tournament" element={<CreateTournamentPage/>}/>

                <Route path="/admin" element={<AdminHomepage/>}/>
                <Route path="/admin/questions" element={<QuestionListPage/>}/>
                <Route path="/admin/create_question" element={<QuestionEditorPage/>}/>
                <Route path="/admin/edit_question/:id" element={<QuestionEditorPage/>}/>
            </Route>
        </Routes>
    );
}

export default Router;
