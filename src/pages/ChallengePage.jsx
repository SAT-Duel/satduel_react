import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Check, ChevronRight, Clock, Minus, Share2, Swords, Trophy, X} from 'lucide-react';
import {Alert, Button, Card, PageContainer, Spinner} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';
import Question from '../components/Question';
import SEO from '../components/SEO';
import api from '../components/api';
import {notify} from '../utils/notify';
import {loginPathFor} from '../utils/authRedirect';
import {challengePath, challengeShareText, challengeUrl} from '../utils/challengeLinks';
import {shareLink} from '../utils/shareLink';

const baseUrl = import.meta.env.VITE_API_URL;

function formatTime(seconds) {
    if (seconds === null) return '--:--';
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function minutesLabel(seconds) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

function Shell({children}) {
    return (
        <div className="sat-bubble-field min-h-screen py-6 sm:py-10">
            <PageContainer className="max-w-4xl">{children}</PageContainer>
        </div>
    );
}

function ResultDots({results, label}) {
    return (
        <div className="flex flex-wrap gap-2" aria-label={label}>
            {results.map((status, index) => {
                const correct = status === 'Correct';
                const blank = status === 'Blank';
                return (
                    <span
                        key={index}
                        title={`Question ${index + 1}: ${status}`}
                        className={[
                            'flex size-8 items-center justify-center rounded-full text-white',
                            correct ? 'bg-emerald-500' : blank ? 'bg-slate-300' : 'bg-rose-500',
                        ].join(' ')}
                    >
                        {correct ? <Check className="size-4"/> : blank ? <Minus className="size-4"/> : <X className="size-4"/>}
                    </span>
                );
            })}
        </div>
    );
}

function ProgressDots({order, results, activeIndex}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {order.map((questionId, index) => {
                const status = results[questionId] || 'Blank';
                const color = status === 'Correct'
                    ? 'bg-emerald-500'
                    : status === 'Incorrect'
                        ? 'bg-rose-500'
                        : index === activeIndex ? 'bg-primary-500 ring-4 ring-primary-100' : 'bg-slate-200';
                return <span key={questionId} className={`size-2.5 rounded-full ${color}`} title={`Question ${index + 1}: ${status}`}/>;
            })}
        </div>
    );
}

/** Opens the share sheet (or copies) for a challenge the viewer may pass on. */
function useShareChallenge(code) {
    return useCallback(async ({score, total}) => {
        const url = challengeUrl(code);
        const outcome = await shareLink({
            title: 'Beat my SAT Duel score',
            text: challengeShareText(score, total),
            url,
        });
        if (outcome === 'copied') notify.success('Challenge link copied. Paste it to a friend.');
        if (outcome === 'failed') notify.info(`Share this link: ${url}`);
    }, [code]);
}

/* ------------------------------------------------------------------ */
/* before playing                                                      */
/* ------------------------------------------------------------------ */

function Invite({summary, code, onStart, starting}) {
    const {creator, creator_score: creatorScore, question_count: total, viewer} = summary;
    const here = challengePath(code);

    return (
        <Card className="sat-arena-card mx-auto max-w-xl overflow-hidden">
            <header className="bg-[#131B2C] px-6 py-7 text-center text-white sm:px-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider">
                    <Swords className="size-4"/> Duel challenge
                </span>
                <h1 className="m-0 mt-3 font-display text-3xl font-black sm:text-4xl">
                    Beat {creator.username}’s {creatorScore}/{total}
                </h1>
                <p className="mx-auto mb-0 mt-2 max-w-md text-sm font-medium text-white/80 sm:text-base">
                    Same {total} Digital SAT questions, same {minutesLabel(summary.duration_seconds)} on the clock.
                </p>
            </header>

            <div className="px-6 py-7 text-center sm:px-10">
                <UserAvatar profile={creator} size="md" rounded="xl" className="mx-auto"/>
                <p className="m-0 mt-3 font-bold text-slate-900">{creator.username}</p>
                <p className="m-0 mt-1 font-display text-4xl font-black text-slate-950">
                    {creatorScore}<span className="text-lg text-slate-300">/{total}</span>
                </p>
                <p className="m-0 mt-1 text-sm font-semibold text-slate-500">the score to beat</p>

                {summary.expired ? (
                    <div className="mt-7">
                        <p className="m-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                            This challenge has ended, so it can’t be started any more.
                        </p>
                        <Button to="/match" className="mt-4" block>Start your own duel</Button>
                    </div>
                ) : viewer.authenticated ? (
                    <div className="mt-7">
                        <Button size="lg" block loading={starting} onClick={onStart}>
                            Play the same {total}
                            <ChevronRight className="size-5"/>
                        </Button>
                        <p className="m-0 mt-3 text-sm text-slate-500">
                            The clock starts when you tap. You get one run, and it doesn’t change your Elo.
                        </p>
                    </div>
                ) : (
                    <div className="mt-7">
                        <Button to={`/register?next=${encodeURIComponent(here)}`} size="lg" block>
                            Create a free account to play
                        </Button>
                        <Button to={loginPathFor(here)} variant="secondary" block className="mt-3">
                            I already have an account
                        </Button>
                        <p className="m-0 mt-3 text-sm text-slate-500">
                            Free, and you come straight back to this challenge once you’re in.
                        </p>
                    </div>
                )}

                {summary.finished_players > 0 && (
                    <p className="m-0 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {summary.finished_players} {summary.finished_players === 1 ? 'player has' : 'players have'} taken it on
                    </p>
                )}
            </div>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* playing                                                             */
/* ------------------------------------------------------------------ */

function Play({summary, code, run, setRun, onDone}) {
    const {questions, results, endsAt} = run;
    const order = questions.map((question) => question.id);
    const firstBlank = order.findIndex((id) => (results[id] || 'Blank') === 'Blank');
    const [activeIndex, setActiveIndex] = useState(firstBlank === -1 ? order.length - 1 : firstBlank);
    const [timeLeft, setTimeLeft] = useState(null);
    const [notice, setNotice] = useState('');
    const closing = useRef(false);

    const closeRun = useCallback(async () => {
        if (closing.current) return;
        closing.current = true;
        try {
            const {data} = await api.post(`api/challenges/${code}/finish/`);
            onDone(data);
        } catch (err) {
            closing.current = false;
            setNotice(err.response?.data?.error || 'Could not finish the challenge. Check your connection.');
        }
    }, [code, onDone]);

    useEffect(() => {
        const deadline = new Date(endsAt);
        const tick = () => {
            const remaining = Math.max(0, Math.round((deadline - new Date()) / 1000));
            setTimeLeft(remaining);
            if (remaining === 0) closeRun();
        };
        tick();
        const timer = setInterval(tick, 500);
        return () => clearInterval(timer);
    }, [closeRun, endsAt]);

    const handleSubmit = async (questionId, choice) => {
        try {
            const {data} = await api.post(`api/challenges/${code}/answer/`, {
                question_id: questionId,
                selected_choice: choice,
            });
            setRun((previous) => ({
                ...previous,
                results: {...previous.results, [questionId]: data.result === 'correct' ? 'Correct' : 'Incorrect'},
            }));
        } catch (err) {
            // The server closes the run when the clock is out; show the result.
            if (err.response?.data?.finished) closeRun();
            else setNotice(err.response?.data?.error || 'Could not save your answer.');
        }
    };

    const activeQuestion = questions[activeIndex];
    const activeStatus = results[activeQuestion.id] || 'Blank';
    const answered = order.filter((id) => (results[id] || 'Blank') !== 'Blank').length;
    const myScore = order.filter((id) => results[id] === 'Correct').length;
    const isLast = activeIndex + 1 === questions.length;
    const {creator} = summary;

    return (
        <>
            {notice && <div className="mb-4"><Alert>{notice}</Alert></div>}

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#131B2C] px-5 py-4 text-white shadow-lg">
                <span className="inline-flex items-center gap-2 font-display text-lg font-bold">
                    <Swords className="size-5 text-primary-300"/> Challenge
                </span>
                <span className="text-sm font-semibold text-slate-300">
                    Question {activeIndex + 1} of {questions.length}
                </span>
                <span
                    className="inline-flex items-center gap-2 font-display text-xl font-bold text-amber-300"
                    role="timer"
                    aria-label={`Time left ${formatTime(timeLeft)}`}
                >
                    <Clock className="size-5"/> {formatTime(timeLeft)}
                </span>
            </div>

            {/* The score to beat sits above the question on every width, so the
                target stays in view on a phone instead of below the fold. */}
            <Card className="mb-4 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <UserAvatar profile={creator} size="xs" className="ring-0"/>
                        <p className="m-0 min-w-0 truncate text-sm font-semibold text-slate-600">
                            <span className="font-bold text-slate-900">{creator.username}</span> scored{' '}
                            <span className="font-black text-slate-950">{summary.creator_score}/{summary.question_count}</span>
                        </p>
                    </div>
                    <p className="m-0 shrink-0 text-sm font-semibold text-slate-600">
                        You <span className="font-black text-slate-950">{myScore}</span>
                        <span className="text-slate-500"> · {answered}/{questions.length}</span>
                    </p>
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3">
                    <ProgressDots order={order} results={results} activeIndex={activeIndex}/>
                </div>
            </Card>

            <Question
                questionData={activeQuestion}
                key={activeQuestion.id}
                onSubmit={handleSubmit}
                status={activeStatus}
                questionNumber={activeIndex + 1}
                totalQuestions={questions.length}
            />
            {activeStatus !== 'Blank' && (
                <div className="mt-4 flex justify-end">
                    {isLast ? (
                        <Button onClick={closeRun}>
                            See the result <ChevronRight className="size-4"/>
                        </Button>
                    ) : (
                        <Button onClick={() => setActiveIndex((index) => index + 1)}>
                            Next question <ChevronRight className="size-4"/>
                        </Button>
                    )}
                </div>
            )}
        </>
    );
}

/* ------------------------------------------------------------------ */
/* after playing, and the creator's view                               */
/* ------------------------------------------------------------------ */

function ScoreRow({row, rank, total}) {
    return (
        <div
            className={[
                'flex items-center gap-3 rounded-xl border px-4 py-3',
                row.is_viewer ? 'border-primary-200 bg-primary-50' : 'border-slate-200 bg-white',
            ].join(' ')}
        >
            <span className="w-6 shrink-0 text-sm font-black text-slate-500">{rank}</span>
            <UserAvatar profile={row} size="xs" className="ring-0"/>
            <div className="min-w-0 flex-1">
                <p className="m-0 truncate font-semibold text-slate-800">
                    {row.username}
                    {row.is_viewer && <span className="font-bold text-primary-700"> (you)</span>}
                </p>
                {row.is_creator && <p className="m-0 text-xs text-slate-500">sent the challenge</p>}
            </div>
            <span className="shrink-0 font-display text-lg font-black text-slate-950">
                {row.score}<span className="text-sm text-slate-400">/{total}</span>
            </span>
        </div>
    );
}

function Outcome({summary, code}) {
    const navigate = useNavigate();
    const share = useShareChallenge(code);
    const {scoreboard, question_count: total, viewer, creator} = summary;
    const mine = scoreboard.find((row) => row.is_viewer);
    const creatorRow = scoreboard.find((row) => row.is_creator);
    const others = scoreboard.filter((row) => !row.is_creator);

    let banner;
    if (viewer.is_creator) {
        banner = {
            classes: 'bg-[#131B2C]',
            eyebrow: 'Your challenge',
            title: others.length
                ? `${others.length} ${others.length === 1 ? 'friend has' : 'friends have'} played`
                : 'Waiting for the first taker',
            text: `Anyone with the link plays your ${total} questions against your ${creatorRow.score}/${total}.`,
        };
    } else if (mine.score > creatorRow.score) {
        banner = {
            classes: 'bg-emerald-600',
            eyebrow: 'Challenge won',
            title: `You beat ${creator.username}`,
            text: `${mine.score} to ${creatorRow.score} on the same ${total} questions.`,
        };
    } else if (mine.score < creatorRow.score) {
        banner = {
            classes: 'bg-rose-600',
            eyebrow: 'Challenge lost',
            title: `${creator.username} holds on`,
            text: `${creatorRow.score} to ${mine.score}. A live duel is the way to get one back.`,
        };
    } else {
        banner = {
            classes: 'bg-slate-800',
            eyebrow: 'Draw',
            title: 'Dead even',
            text: `${mine.score} each on the same ${total} questions.`,
        };
    }

    return (
        <>
            <Card className="sat-arena-card overflow-hidden">
                <header className={`${banner.classes} px-6 py-7 text-center text-white sm:px-10 sm:py-9`}>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider">
                        {!viewer.is_creator && mine.score > creatorRow.score ? <Trophy className="size-4"/> : <Swords className="size-4"/>}
                        {banner.eyebrow}
                    </span>
                    <h1 className="m-0 mt-3 font-display text-3xl font-black sm:text-4xl">{banner.title}</h1>
                    <p className="mx-auto mb-0 mt-2 max-w-md text-sm font-medium text-white/80 sm:text-base">{banner.text}</p>
                </header>

                <div className="space-y-2 p-5 sm:p-6">
                    {scoreboard.map((row, index) => (
                        <ScoreRow key={row.id} row={row} rank={index + 1} total={total}/>
                    ))}
                    <p className="m-0 pt-2 text-center text-sm text-slate-500">
                        Challenges don’t change Elo.
                        {summary.expired
                            ? ' This one has ended.'
                            : ` Open until ${new Date(summary.expires_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}.`}
                    </p>
                </div>
            </Card>

            {!viewer.is_creator && (
                <Card className="mt-5 p-5 sm:p-6">
                    <h2 className="m-0 text-lg font-bold text-slate-900">Question breakdown</h2>
                    <div className="mt-5 space-y-5">
                        {[[mine, 'You'], [creatorRow, creator.username]].map(([row, label]) => (
                            <div key={label} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="w-32 shrink-0">
                                    <p className="m-0 truncate text-sm font-bold text-slate-800">{label}</p>
                                    <p className="m-0 text-xs text-slate-500">{row.score} correct</p>
                                </div>
                                <ResultDots results={row.results} label={`${label}: question results`}/>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row">
                <Button onClick={() => navigate('/match')} variant="secondary">
                    <Swords className="size-4"/> Play a live duel
                </Button>
                {!summary.expired && (
                    <Button onClick={() => share({score: (mine || creatorRow).score, total})}>
                        <Share2 className="size-4"/>
                        {viewer.is_creator ? 'Share the challenge link' : 'Pass it on to a friend'}
                    </Button>
                )}
            </div>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */

function ChallengePage() {
    const {code} = useParams();
    const {user, loading: authLoading} = useAuth();
    const [summary, setSummary] = useState(null);
    const [run, setRun] = useState(null); // {questions, results, endsAt} while playing
    const [missing, setMissing] = useState(false);
    const [error, setError] = useState('');
    const [starting, setStarting] = useState(false);

    const beginRun = useCallback(async () => {
        setStarting(true);
        setError('');
        try {
            const {data} = await api.post(`api/challenges/${code}/start/`);
            setRun({questions: data.questions, results: data.results, endsAt: data.ends_at});
        } catch (err) {
            setError(err.response?.data?.error || 'Could not start the challenge.');
        } finally {
            setStarting(false);
        }
    }, [code]);

    useEffect(() => {
        if (authLoading) return undefined;
        let cancelled = false;
        const load = async () => {
            const path = `api/challenges/${code}/`;
            try {
                let response;
                try {
                    response = await api.get(path);
                } catch (err) {
                    // The invite is public. A stale token must not hide it from
                    // someone who is effectively signed out.
                    if (err.response?.status !== 401) throw err;
                    response = await axios.get(`${baseUrl}/${path}`);
                }
                if (cancelled) return;
                setSummary(response.data);
                // A reload mid-run picks up where the clock is, not from the top.
                if (response.data.viewer.status === 'playing') beginRun();
            } catch (err) {
                if (cancelled) return;
                if (err.response?.status === 404) setMissing(true);
                else setError('Could not load this challenge. Check your connection and try again.');
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [authLoading, beginRun, code, user?.id]);

    const handleDone = useCallback((finalSummary) => {
        setRun(null);
        setSummary(finalSummary);
    }, []);

    let body;
    if (missing) {
        body = (
            <Card className="mx-auto max-w-xl p-8 text-center">
                <h1 className="m-0 font-display text-2xl font-black text-slate-950">This challenge link isn’t valid</h1>
                <p className="m-0 mt-2 text-slate-600">
                    Check that the whole link was copied, or ask your friend to send it again.
                </p>
                <Button to="/match" className="mt-6">Start your own duel</Button>
            </Card>
        );
    } else if (!summary) {
        body = error
            ? <div className="mx-auto max-w-xl"><Alert>{error}</Alert></div>
            : (
                <div className="flex justify-center py-16">
                    <div className="flex items-center gap-3 text-slate-600"><Spinner/> Loading challenge…</div>
                </div>
            );
    } else if (run) {
        body = <Play summary={summary} code={code} run={run} setRun={setRun} onDone={handleDone}/>;
    } else if (summary.scoreboard) {
        body = <Outcome summary={summary} code={code}/>;
    } else {
        body = (
            <>
                {error && <div className="mx-auto mb-4 max-w-xl"><Alert>{error}</Alert></div>}
                <Invite summary={summary} code={code} onStart={beginRun} starting={starting}/>
            </>
        );
    }

    return (
        <Shell>
            <SEO
                title="You have been challenged to an SAT duel"
                description="A friend finished ten Digital SAT questions and sent you the same set. Play them and see who scored higher."
                path={challengePath(code)}
                image="/og/challenge.png"
                noindex
            />
            <div className="mb-5 flex items-center justify-between">
                <Link to="/" className="font-display text-lg font-black text-slate-950 no-underline">
                    SAT<span className="text-primary-600">Duel</span>
                </Link>
            </div>
            {body}
        </Shell>
    );
}

export default ChallengePage;
