import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import SecondaryLayout from "../layout/SecondaryLayout";

// Lazy load components
const HomePage = React.lazy(() => import("../pages/HomePage"));
const AboutPage = React.lazy(() => import("../pages/AboutPage"));
const QuestionsPage = React.lazy(() => import("../pages/QuestionPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));
const ProfilePage = React.lazy(() => import("../pages/ProfilePage"));
const Match = React.lazy(() => import("../pages/MatchingPage"));
const DuelBattle = React.lazy(() => import("../pages/DuelBattlePage"));
const BattleResultPage = React.lazy(() => import("../pages/BattleResultPage"));
const MatchLoadingPage = React.lazy(() => import("../pages/MatchLoadingPage"));
const TrainerPage = React.lazy(() => import("../pages/TrainerPage"));
const InfiniteQuestionPage = React.lazy(() => import("../pages/InfiniteQuestionPage"));
const ConfirmEmail = React.lazy(() => import("./ConfirmEmail"));
const EmailVerificationPage = React.lazy(() => import("../pages/EmailVerificationPage"));
const PowerSprintHome = React.lazy(() => import("../pages/PowerSprintHome"));
const PowerSprintPage = React.lazy(() => import("../pages/PowerSprintPage"));
const SATSurvivalHomepage = React.lazy(() => import("../pages/SATSurvivalHomepage"));
const SATSurvivalPage = React.lazy(() => import("../pages/SATSurvivalPage"));
const TournamentPage = React.lazy(() => import("../pages/TournamentPage"));
const RankingPage = React.lazy(() => import("../pages/RankingPage"));
const TournamentListPage = React.lazy(() => import("../pages/TournamentListPage"));
const TournamentDetailPage = React.lazy(() => import("../pages/TournamentDetailPage"));
const TournamentQuestionPage = React.lazy(() => import("../pages/TournamentQuestionPage"));
const CreateTournamentPage = React.lazy(() => import("../pages/CreateTournamentPage"));
const BotTrainingPage = React.lazy(() => import("../pages/BotTrainingPage"));
const BotGamePage = React.lazy(() => import("../pages/BotGamePage"));
const ShopPage = React.lazy(() => import("../pages/ShopPage"));
const HousePage = React.lazy(() => import("../pages/HousePage"));
const CollegeTownPage = React.lazy(() => import("../pages/CollegeTownPage"));
const PasswordResetPage = React.lazy(() => import("../pages/PasswordResetPage"));
const PasswordResetConfirmPage = React.lazy(() => import("../pages/PasswordResetConfirmPage"));
const AdminHomepage = React.lazy(() => import("../pages/admin/AdminHomepage"));
const QuestionListPage = React.lazy(() => import("../pages/admin/QuestionListPage"));
const QuestionEditorPage = React.lazy(() => import("../pages/admin/QuestionEditorPage"));
const AdminCreateTournamentPage = React.lazy(() => import("../pages/admin/AdminCreateTournamentPage"));
const SATDuelHomePage = React.lazy(() => import("../pages/satduel/SATDuelHomePage"));
const WaitingRoomPage = React.lazy(() => import("../pages/satduel/WaitingRoomPage"));

function Router() {
    return (
        <Routes>
            <Route element={<SecondaryLayout />}>
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <HomePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <LoginPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <RegisterPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/confirm-email/:key"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <ConfirmEmail />
                        </Suspense>
                    }
                />
                <Route
                    path="/email_verification/:email"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <EmailVerificationPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/password_reset"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <PasswordResetPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/api/reset/:uidb64/:token"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <PasswordResetConfirmPage />
                        </Suspense>
                    }
                />

                <Route
                    path="/about"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <AboutPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/match"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <Match />
                        </Suspense>
                    }
                />
                <Route
                    path="/duel_battle/:roomId"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <DuelBattle />
                        </Suspense>
                    }
                />
                <Route
                    path="/battle_result/:roomId"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <BattleResultPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/match-loading/:roomId"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <MatchLoadingPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/questions"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <QuestionsPage />
                        </Suspense>
                    }
                />

                <Route
                    path="/trainer"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <TrainerPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/infinite_questions"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <InfiniteQuestionPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/power_sprint_home"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <PowerSprintHome />
                        </Suspense>
                    }
                />
                <Route
                    path="/power_sprint"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <PowerSprintPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/sat_survival_home"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <SATSurvivalHomepage />
                        </Suspense>
                    }
                />
                <Route
                    path="/sat_survival"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <SATSurvivalPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/ranking"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <RankingPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/bot_training"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <BotTrainingPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/bot_training/start"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <BotGamePage />
                        </Suspense>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <ProfilePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/profile/:userId"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <ProfilePage />
                        </Suspense>
                    }
                />

                <Route
                    path="/tournaments"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <TournamentListPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/tournaments/info"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <TournamentPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/tournament/:tournamentId"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <TournamentDetailPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/tournament/:tournamentId/questions"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <TournamentQuestionPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/create_tournament"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <CreateTournamentPage />
                        </Suspense>
                    }
                />

                <Route
                    path="/shop"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <ShopPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/house"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <HousePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/town"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <CollegeTownPage />
                        </Suspense>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <AdminHomepage />
                        </Suspense>
                    }
                />
                <Route
                    path="/admin/questions"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <QuestionListPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/admin/create_question"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <QuestionEditorPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/admin/edit_question/:id"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <QuestionEditorPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/admin/create_tournament"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <AdminCreateTournamentPage />
                        </Suspense>
                    }
                />

                <Route
                    path="/duels"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <SATDuelHomePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/waiting-room/:gameId"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <WaitingRoomPage />
                        </Suspense>
                    }
                />
            </Route>
        </Routes>
    );
}

export default Router;
