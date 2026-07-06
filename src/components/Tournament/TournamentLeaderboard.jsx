import React, {useEffect, useState} from 'react';
import {Check, Minus, Trophy, X} from 'lucide-react';

const getStatusClasses = (status) => {
    if (status === 'Correct') return 'bg-emerald-500 text-white';
    if (status === 'Incorrect') return 'bg-rose-500 text-white';
    return 'bg-slate-200 text-slate-500';
};

const getStatusIcon = (status) => {
    if (status === 'Correct') return Check;
    if (status === 'Incorrect') return X;
    return Minus;
};

function TournamentLeaderboard({leaderboardData = [], tournamentStartTime}) {
    const [currentDuration, setCurrentDuration] = useState(0);

    useEffect(() => {
        if (!tournamentStartTime) return undefined;
        const timer = setInterval(() => {
            const now = new Date();
            const start = new Date(tournamentStartTime);
            setCurrentDuration(Math.max(0, Math.floor((now - start) / 1000)));
        }, 1000);

        return () => clearInterval(timer);
    }, [tournamentStartTime]);

    const getQuestionStatus = (question, duration) => {
        if (!question.time_taken) return 'Blank';
        const [hours, minutes, seconds] = question.time_taken.split(':');
        const questionDuration =
            parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseFloat(seconds);
        return questionDuration <= duration ? question.status : 'Blank';
    };

    const calculateScore = (participant, duration) => (
        participant.tournament_questions.reduce((score, question) => (
            getQuestionStatus(question, duration) === 'Correct' ? score + 1 : score
        ), 0)
    );

    const convertDurationToSeconds = (duration) => {
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const getLastCorrectSubmission = (participant, duration) => {
        const correctQuestions = participant.tournament_questions.filter(
            (question) => getQuestionStatus(question, duration) === 'Correct'
        );
        if (correctQuestions.length === 0) return Infinity;
        return Math.max(...correctQuestions.map((question) => convertDurationToSeconds(question.time_taken)));
    };

    const sortedLeaderboard = [...leaderboardData].sort((a, b) => {
        const scoreA = calculateScore(a, currentDuration);
        const scoreB = calculateScore(b, currentDuration);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return getLastCorrectSubmission(a, currentDuration) - getLastCorrectSubmission(b, currentDuration);
    });

    return (
        <div className="sat-arena-card overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="sat-score-strip flex items-center justify-between px-5 py-4">
                <h3 className="m-0 flex items-center gap-2 font-display text-xl font-black text-slate-950">
                    <Trophy className="size-5 text-amber-600"/> Leaderboard
                </h3>
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-black uppercase text-slate-500">
                    Live
                </span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
                {sortedLeaderboard.length ? (
                    <div className="space-y-2">
                        {sortedLeaderboard.map((participant, index) => {
                            const currentScore = calculateScore(participant, currentDuration);
                            return (
                                <div key={participant.user.id} className="rounded-xl border border-slate-200 bg-white p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="m-0 truncate font-black text-slate-900">{participant.user.username}</p>
                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    {participant.tournament_questions.map((question, qIndex) => {
                                                        const status = getQuestionStatus(question, currentDuration);
                                                        const Icon = getStatusIcon(status);
                                                        return (
                                                            <span
                                                                key={qIndex}
                                                                className={`inline-flex size-5 items-center justify-center rounded-full ${getStatusClasses(status)}`}
                                                                title={status}
                                                            >
                                                                <Icon className="size-3"/>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-primary-50 px-3 py-2 text-center">
                                            <p className="m-0 font-display text-2xl font-black text-primary-700">{currentScore}</p>
                                            <p className="m-0 text-[10px] font-black uppercase text-primary-500">score</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                        <p className="m-0 font-semibold text-slate-700">No entries yet</p>
                        <p className="m-0 mt-1 text-sm text-slate-500">Leaderboard activity will appear once students submit answers.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TournamentLeaderboard;
