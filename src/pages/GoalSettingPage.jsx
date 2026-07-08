import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useNavigate} from 'react-router-dom';
import api from '../components/api';
import {Button} from '../components/ui';
import {consumePostLoginRedirect} from '../utils/authRedirect';

const GOAL_OPTIONS = [
    {
        title: 'Beginner Path',
        score: 1500,
        dailyQuestions: 5,
        weeklyQuestions: 40,
        accent: 'border-rose-200 bg-rose-50',
        key: 'beginner',
    },
    {
        title: 'Steady Learner',
        score: 1540,
        dailyQuestions: 10,
        weeklyQuestions: 100,
        accent: 'border-sky-200 bg-sky-50',
        key: 'intermediate',
    },
    {
        title: 'Advanced Track',
        score: 1570,
        dailyQuestions: 20,
        weeklyQuestions: 150,
        accent: 'border-emerald-200 bg-emerald-50',
        key: 'advanced',
    },
    {
        title: 'Expert Challenge',
        score: 1600,
        dailyQuestions: 40,
        weeklyQuestions: 250,
        accent: 'border-amber-200 bg-amber-50',
        key: 'expert',
    },
];

const GoalSettingPage = () => {
    const [selected, setSelected] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!selected) return;
        setSubmitting(true);
        try {
            await api.post('api/set_goal/', {goal: selected.key});
            const redirectTo = consumePostLoginRedirect();
            if (redirectTo) {
                navigate(redirectTo);
            } else {
                navigate('/practice_test', {
                    state: {isNewUser: true, fromGoalSetting: true},
                });
            }
        } catch (e) {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10">
            <Helmet>
                <title>Set your goal | SAT Duel</title>
            </Helmet>
            <div className="mb-10 text-center">
                <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                    Set your learning goal
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                    Choose your dedication level — you can change it anytime.
                </p>
            </div>

            <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {GOAL_OPTIONS.map((goal) => {
                    const isSelected = selected?.key === goal.key;
                    return (
                        <button
                            key={goal.key}
                            onClick={() => setSelected(goal)}
                            className={[
                                'cursor-pointer rounded-2xl border-2 p-6 text-center transition-all',
                                goal.accent,
                                isSelected
                                    ? 'border-primary-500 shadow-md ring-2 ring-primary-200'
                                    : 'hover:shadow-md',
                            ].join(' ')}
                        >
                            <h3 className="text-lg font-bold text-slate-900">{goal.title}</h3>
                            <p className="mt-2 font-display text-2xl font-bold text-primary-700">
                                {goal.score}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                target score
                            </p>
                            <div className="mt-4 space-y-1 text-sm text-slate-600">
                                <p className="m-0">{goal.dailyQuestions} questions / day</p>
                                <p className="m-0">{goal.weeklyQuestions} questions / week</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-10 h-14">
                {selected && (
                    <Button size="lg" loading={submitting} onClick={handleSubmit}>
                        Start my learning journey
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GoalSettingPage;
