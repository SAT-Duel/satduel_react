import React, {Suspense} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import SecondaryLayout from "../layout/SecondaryLayout";
import AppLayout from "../layout/AppLayout";
import WelcomePage from "../pages/WelcomePage";
import CompleteProfilePage from "../pages/CompleteProfilePage";
import {useAuth} from "../context/AuthContext";

const DiagnosticPage = React.lazy(() => import("../pages/DiagnosticPage"));
const SettingsPage = React.lazy(() => import("../pages/SettingsPage"));
const PricingPage = React.lazy(() => import("../pages/PricingPage"));
const LegalPage = React.lazy(() => import("../pages/LegalPage"));

const HomePage = React.lazy(() => import("../pages/HomePage"));
const AboutPage = React.lazy(() => import("../pages/AboutPage"));
const SEOGuidePage = React.lazy(() => import("../pages/seo/SEOGuidePage"));
const QuestionsPage = React.lazy(() => import("../pages/QuestionPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));
const ProfilePage = React.lazy(() => import("../pages/ProfilePage"));
const Match = React.lazy(() => import("../pages/MatchingPage"));
const DuelBattle = React.lazy(() => import("../pages/DuelBattlePage"));
const BattleResultPage = React.lazy(() => import("../pages/BattleResultPage"));
const MatchLoadingPage = React.lazy(() => import("../pages/MatchLoadingPage"));
const HomeDashboard = React.lazy(() => import("../pages/HomeDashboard"));
const StudyGuidePage = React.lazy(() => import("../pages/StudyGuidePage"));
const StudyGuideLessonPage = React.lazy(() => import("../pages/StudyGuideLessonPage"));
const InfiniteQuestionPage = React.lazy(() => import("../pages/trainer/InfiniteQuestionPage"));
const PracticeHistoryPage = React.lazy(() => import("../pages/trainer/PracticeHistoryPage"));
const SavedQuestionsPage = React.lazy(() => import("../pages/trainer/SavedQuestionsPage"));
const MistakeReviewPage = React.lazy(() => import("../pages/trainer/MistakeReviewPage"));
const ConfirmEmail = React.lazy(() => import("./ConfirmEmail"));
const EmailVerificationPage = React.lazy(() => import("../pages/EmailVerificationPage"));
const PowerSprintHome = React.lazy(() => import("../pages/trainer/PowerSprintHome"));
const PowerSprintPage = React.lazy(() => import("../pages/trainer/PowerSprintPage"));
const SATSurvivalHomepage = React.lazy(() => import("../pages/trainer/SATSurvivalHomepage"));
const SATSurvivalPage = React.lazy(() => import("../pages/trainer/SATSurvivalPage"));
const TimedChallengePage = React.lazy(() => import("../pages/trainer/TimedChallengePage"));
const TournamentPage = React.lazy(() => import("../pages/TournamentPage"));
const RankingPage = React.lazy(() => import("../pages/RankingPage"));
const TournamentListPage = React.lazy(() => import("../pages/TournamentListPage"));
const TournamentDetailPage = React.lazy(() => import("../pages/TournamentDetailPage"));
const JoinTournamentLinkPage = React.lazy(() => import("../pages/JoinTournamentLinkPage"));
const TournamentQuestionPage = React.lazy(() => import("../pages/TournamentQuestionPage"));
const CreateTournamentPage = React.lazy(() => import("../pages/CreateTournamentPage"));
const BotTrainingPage = React.lazy(() => import("../pages/BotTrainingPage"));
const BotGamePage = React.lazy(() => import("../pages/BotGamePage"));
const ShopPage = React.lazy(() => import("../pages/ShopPage"));
const PasswordResetPage = React.lazy(() => import("../pages/PasswordResetPage"));
const PasswordResetConfirmPage = React.lazy(() => import("../pages/PasswordResetConfirmPage"));
const AdminHomepage = React.lazy(() => import("../pages/admin/AdminHomepage"));
const QuestionReportsPage = React.lazy(() => import("../pages/admin/QuestionReportsPage"));
const QuestionListPage = React.lazy(() => import("../pages/admin/QuestionListPage"));
const QuestionEditorPage = React.lazy(() => import("../pages/admin/QuestionEditorPage"));
const QuestionGeneratorPage = React.lazy(() => import("../pages/admin/QuestionGeneratorPage"));
const AdminCreateTournamentPage = React.lazy(() => import("../pages/admin/AdminCreateTournamentPage"));
const SATDuelHomePage = React.lazy(() => import("../pages/satduel/SATDuelHomePage"));
const WaitingRoomPage = React.lazy(() => import("../pages/satduel/WaitingRoomPage"));
const MyTournamentsPage = React.lazy(() => import("../pages/MyTournamentsPage"));
const TestPage = React.lazy(() => import("../pages/practice_test/TestPage"));
const TestResultPage = React.lazy(() => import("../pages/practice_test/TestResultPage"));
const PracticeTestPage = React.lazy(() => import("../pages/practice_test/PracticeTestPage"));
const ClassListPage = React.lazy(() => import("../pages/classes/ClassListPage"));
const PartyHomePage = React.lazy(() => import("../pages/party/PartyHomePage"));
const PartyRoomPage = React.lazy(() => import("../pages/party/PartyRoomPage"));

const Loading = () => <div className="p-8 text-center text-slate-400">Loading…</div>;
const S = (el) => <Suspense fallback={<Loading/>}>{el}</Suspense>;

// Prospects see the marketing landing page; logged-in users are pushed straight
// into the learning experience so they don't linger on the front page.
function HomeRoute() {
    const {user, loading} = useAuth();
    if (loading) return null;
    return user ? <Navigate to="/trainer" replace/> : S(<HomePage/>);
}

// Marketing / onboarding: rendered inside the top-nav layout.
const MARKETING_ROUTES = [
    {path: '/login', el: <LoginPage/>},
    {path: '/register', el: <RegisterPage/>},
    {path: '/diagnostic', el: <DiagnosticPage/>},
    {path: '/pricing', el: <PricingPage/>},
    {path: '/about', el: <AboutPage/>},
    {path: '/terms', el: <LegalPage kind="terms"/>},
    {path: '/privacy', el: <LegalPage kind="privacy"/>},
    {path: '/refund-policy', el: <LegalPage kind="refunds"/>},
    {path: '/digital-sat-practice', el: <SEOGuidePage pageKey="digitalSatPractice"/>},
    {path: '/sat-reading-and-writing-practice', el: <SEOGuidePage pageKey="satReadingWriting"/>},
    {path: '/sat-math-practice', el: <SEOGuidePage pageKey="satMath"/>},
    {path: '/sat-vocabulary-words-in-context', el: <SEOGuidePage pageKey="wordsInContext"/>},
    {path: '/digital-sat-score-guide', el: <SEOGuidePage pageKey="scoreGuide"/>},
    {path: '/confirm-email/:key', el: <ConfirmEmail/>},
    {path: '/email_verification/:email', el: <EmailVerificationPage/>},
    {path: '/password_reset', el: <PasswordResetPage/>},
    {path: '/api/reset/:uidb64/:token', el: <PasswordResetConfirmPage/>},
];

// The logged-in learning experience: rendered inside the sidebar app shell
// (AppLayout gates access and redirects anonymous users to /login).
const APP_ROUTES = [
    {path: '/trainer', el: <HomeDashboard/>},
    {path: '/infinite_questions', el: <InfiniteQuestionPage/>},
    {path: '/practice-history', el: <PracticeHistoryPage/>},
    {path: '/saved-questions', el: <SavedQuestionsPage/>},
    {path: '/study_guides', el: <StudyGuidePage/>},
    {path: '/study_guides/:slug', el: <StudyGuideLessonPage/>},
    {path: '/match', el: <Match/>},
    {path: '/questions', el: <QuestionsPage/>},
    {path: '/power_sprint_home', el: <PowerSprintHome/>},
    {path: '/sat_survival_home', el: <SATSurvivalHomepage/>},
    {path: '/timed_challenges', el: <TimedChallengePage/>},
    {path: '/ranking', el: <RankingPage/>},
    {path: '/bot_training', el: <BotTrainingPage/>},
    {path: '/profile', el: <ProfilePage/>},
    {path: '/profile/:userId', el: <ProfilePage/>},
    {path: '/tournaments', el: <TournamentListPage/>},
    {path: '/tournaments/info', el: <TournamentPage/>},
    {path: '/tournaments/join/:joinCode', el: <JoinTournamentLinkPage/>},
    {path: '/tournament/:tournamentId', el: <TournamentDetailPage/>},
    {path: '/create_tournament', el: <CreateTournamentPage/>},
    {path: '/my_tournaments', el: <MyTournamentsPage/>},
    {path: '/shop', el: <ShopPage/>},
    {path: '/duels', el: <SATDuelHomePage/>},
    {path: '/party', el: <PartyHomePage/>},
    {path: '/practice_test', el: <PracticeTestPage/>},
    {path: '/classes', el: <ClassListPage/>},
    {path: '/settings', el: <SettingsPage/>},
    {path: '/upgrade', el: <PricingPage/>},  // in-app pricing (keeps the shell)
    {path: '/admin', el: <AdminHomepage/>},
    {path: '/admin/question_reports', el: <QuestionReportsPage/>},
    {path: '/admin/questions', el: <QuestionListPage/>},
    {path: '/admin/create_question', el: <QuestionEditorPage/>},
    {path: '/admin/generate_questions', el: <QuestionGeneratorPage/>},
    {path: '/admin/edit_question/:id', el: <QuestionEditorPage/>},
    {path: '/admin/create_tournament', el: <AdminCreateTournamentPage/>},
];

// Focused, distraction-free experiences: no sidebar or top nav.
const FULLSCREEN_ROUTES = [
    {path: '/duel_battle/:roomId', el: <DuelBattle/>},
    {path: '/battle_result/:roomId', el: <BattleResultPage/>},
    {path: '/match-loading/:roomId', el: <MatchLoadingPage/>},
    {path: '/power_sprint', el: <PowerSprintPage/>},
    {path: '/sat_survival', el: <SATSurvivalPage/>},
    {path: '/bot_training/start', el: <BotGamePage/>},
    {path: '/waiting-room/:gameId', el: <WaitingRoomPage/>},
    {path: '/party/:roomId', el: <PartyRoomPage/>},
    {path: '/tournament/:tournamentId/questions', el: <TournamentQuestionPage/>},
    {path: '/full_length_test', el: <TestPage/>},
    {path: '/test_result', el: <TestResultPage/>},
    {path: '/mistake-review', el: <MistakeReviewPage/>},
    {path: '/welcome', el: <WelcomePage/>},
    {path: '/complete_profile', el: <CompleteProfilePage/>},
];

function Router() {
    return (
        <Routes>
            {/* Marketing / onboarding */}
            <Route element={<SecondaryLayout/>}>
                <Route path="/" element={<HomeRoute/>}/>
                {MARKETING_ROUTES.map((r) => (
                    <Route key={r.path} path={r.path} element={S(r.el)}/>
                ))}
            </Route>

            {/* Logged-in app shell */}
            <Route element={<AppLayout/>}>
                {APP_ROUTES.map((r) => (
                    <Route key={r.path} path={r.path} element={S(r.el)}/>
                ))}
            </Route>

            {/* Fullscreen focused flows */}
            {FULLSCREEN_ROUTES.map((r) => (
                <Route key={r.path} path={r.path} element={S(r.el)}/>
            ))}
        </Routes>
    );
}

export default Router;
