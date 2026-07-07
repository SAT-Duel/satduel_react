import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, Crown, Flame, LineChart, Medal, RefreshCw, Swords} from 'lucide-react';
import {Alert, Button, Card, PageContainer, Spinner} from '../components/ui';
import UserAvatar from '../components/UserAvatar';
import api from '../components/api';

const METRICS = [
    {
        id: 'duel',
        label: 'Duel',
        title: 'Duel rating',
        shortLabel: 'Duel',
        icon: Swords,
        accent: 'text-primary-700 bg-primary-50 border-primary-200',
    },
    {
        id: 'practice',
        label: 'Practice',
        title: 'Practice rating',
        shortLabel: 'Practice',
        icon: LineChart,
        accent: 'text-sky-700 bg-sky-50 border-sky-200',
    },
    {
        id: 'streak',
        label: 'Correct streak',
        title: 'Best run of correct answers',
        shortLabel: 'Correct streak',
        icon: Flame,
        accent: 'text-amber-700 bg-amber-50 border-amber-200',
    },
];

function metricConfig(metric) {
    return METRICS.find((item) => item.id === metric) || METRICS[0];
}

function metricValue(entry, metric) {
    if (!entry) return '—';
    if (metric === 'streak') return `${entry.max_streak ?? entry.metric_value ?? 0}`;
    return entry.metric_value ?? (metric === 'practice' ? entry.sp_elo_rating : entry.elo_rating) ?? '—';
}

function metricUnit(metric) {
    return metric === 'streak' ? 'questions' : 'Elo';
}

function secondaryLine(entry) {
    const answered = entry?.questions_answered ?? 0;
    const grade = entry?.grade ? `Grade ${entry.grade}` : 'Student';
    return `${grade} · ${answered} answered`;
}

// Top-three get the honors: gold / silver / bronze medallions, a tinted row,
// a ring, and a medal or crown. Everyone else stays clean and neutral.
const PODIUM = {
    1: {
        icon: Crown,
        badge: 'bg-gradient-to-br from-amber-300 to-amber-500 text-white border-amber-300 shadow-md shadow-amber-200',
        row: 'bg-gradient-to-r from-amber-50 to-white ring-1 ring-inset ring-amber-200',
        value: 'text-amber-600',
        label: '1st',
        labelChip: 'bg-amber-100 text-amber-800',
    },
    2: {
        icon: Medal,
        badge: 'bg-gradient-to-br from-slate-300 to-slate-500 text-white border-slate-300 shadow-md shadow-slate-200',
        row: 'bg-gradient-to-r from-slate-50 to-white ring-1 ring-inset ring-slate-200',
        value: 'text-slate-600',
        label: '2nd',
        labelChip: 'bg-slate-200 text-slate-700',
    },
    3: {
        icon: Medal,
        badge: 'bg-gradient-to-br from-orange-300 to-orange-600 text-white border-orange-300 shadow-md shadow-orange-200',
        row: 'bg-gradient-to-r from-orange-50 to-white ring-1 ring-inset ring-orange-200',
        value: 'text-orange-600',
        label: '3rd',
        labelChip: 'bg-orange-100 text-orange-800',
    },
};

function RankBadge({rank}) {
    const podium = PODIUM[rank];
    if (podium) {
        const Icon = podium.icon;
        return (
            <span className={[
                'relative inline-flex size-11 shrink-0 flex-col items-center justify-center rounded-xl border font-black',
                podium.badge,
            ].join(' ')}>
                <Icon className="size-4"/>
                <span className="text-[11px] leading-none">{rank}</span>
            </span>
        );
    }
    return (
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-500">
            #{rank}
        </span>
    );
}

function LeaderboardRow({entry, metric, highlighted = false}) {
    const podium = PODIUM[entry.rank];
    const rowTone = highlighted
        ? 'bg-primary-50/70'
        : podium
            ? podium.row
            : 'bg-white hover:bg-slate-50';
    return (
        <Link
            to={`/profile/${entry.user.id}`}
            className={[
                'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-100 no-underline transition-colors last:border-b-0 sm:px-5',
                podium ? 'px-4 py-4' : 'px-4 py-3',
                rowTone,
            ].join(' ')}
        >
            <RankBadge rank={entry.rank}/>
            <div className="flex min-w-0 items-center gap-3">
                <UserAvatar profile={entry} size={podium ? 'md' : 'sm'} className="ring-0"/>
                <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                        <p className={[
                            'm-0 truncate font-bold text-slate-900',
                            podium ? 'text-[15px] sm:text-base' : '',
                        ].join(' ')}>{entry.user.username}</p>
                        {podium && (
                            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${podium.labelChip}`}>
                                {podium.label}
                            </span>
                        )}
                        {entry.is_premium && <Crown className="size-4 shrink-0 text-amber-500"/>}
                    </div>
                    <p className="m-0 mt-0.5 truncate text-sm text-slate-500">{secondaryLine(entry)}</p>
                    <p className="m-0 mt-1 hidden truncate text-xs font-medium text-slate-400 sm:block">
                        Duel {entry.elo_rating} · English {entry.sp_elo_rating} · Math {entry.math_elo_rating} · Best streak {entry.max_streak}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className={[
                    'm-0 font-black sm:text-xl',
                    podium ? `text-xl ${podium.value}` : 'text-lg text-slate-900',
                ].join(' ')}>{metricValue(entry, metric)}</p>
                <p className="m-0 text-xs font-bold text-slate-400">{metricUnit(metric)}</p>
            </div>
        </Link>
    );
}

function CurrentRankStrip({entry, metric, totalUsers}) {
    if (!entry) return null;
    const percentile = totalUsers > 0
        ? Math.max(1, Math.round(((totalUsers - entry.rank + 1) / totalUsers) * 100))
        : null;

    return (
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-primary-200 bg-primary-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
                <UserAvatar profile={entry} size="sm" className="ring-0"/>
                <div className="min-w-0">
                    <p className="m-0 text-sm font-bold text-primary-700">Your standing</p>
                    <p className="m-0 truncate text-sm text-slate-600">
                        #{entry.rank} of {totalUsers}{percentile ? ` · Top ${percentile}%` : ''}
                    </p>
                </div>
            </div>
            <div className="text-left sm:text-right">
                <p className="m-0 text-xl font-black text-slate-900">{metricValue(entry, metric)}</p>
                <p className="m-0 text-xs font-bold text-slate-500">{metricConfig(metric).shortLabel}</p>
            </div>
        </div>
    );
}

function EmptyState({onRetry}) {
    return (
        <Card className="p-8 text-center">
            <Medal className="mx-auto size-10 text-slate-300"/>
            <h2 className="m-0 mt-3 text-xl font-bold text-slate-900">No rankings yet</h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">
                Once students practice or duel, this page will fill with live standings.
            </p>
            <Button onClick={onRetry} variant="secondary" className="mt-5">
                <RefreshCw className="size-4"/> Refresh
            </Button>
        </Card>
    );
}

// Practice splits into two boards; the API metric differs from the tab id.
function apiMetricFor(metric, practiceSubject) {
    if (metric === 'practice' && practiceSubject === 'math') return 'practice_math';
    return metric;
}

function RankingPage() {
    const [metric, setMetric] = useState('duel');
    const [practiceSubject, setPracticeSubject] = useState('english');
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const config = metricConfig(metric);
    const Icon = config.icon;
    const entries = leaderboard?.entries || [];
    const isPractice = metric === 'practice';

    const fetchLeaderboard = async (nextMetric = metric, nextSubject = practiceSubject) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/leaderboard/', {
                params: {metric: apiMetricFor(nextMetric, nextSubject), limit: 50},
            });
            setLeaderboard(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Could not load the leaderboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard(metric, practiceSubject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metric, practiceSubject]);

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-6 sm:py-8">
            <PageContainer>
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="m-0 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                            Leaderboard
                        </h1>
                        <p className="m-0 mt-1 text-sm text-slate-500">
                            Ranked by {config.title.toLowerCase()}{isPractice ? ` · ${practiceSubject === 'math' ? 'Math' : 'English'}` : ''}.
                        </p>
                    </div>
                    <Button to="/infinite_questions" variant="secondary">
                        Practice now <ArrowUpRight className="size-4"/>
                    </Button>
                </div>

                <div className="mb-5 overflow-x-auto">
                    <div className="inline-flex min-w-full rounded-2xl border border-slate-200 bg-white p-1 sm:min-w-0">
                        {METRICS.map(({id, label, icon: MetricIcon}) => {
                        const selected = metric === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setMetric(id)}
                                className={[
                                    'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors sm:flex-none sm:justify-start sm:px-4',
                                    selected ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                                ].join(' ')}
                            >
                                <MetricIcon className="size-4"/>
                                <span>{label}</span>
                            </button>
                        );
                        })}
                    </div>
                </div>

                {error && (
                    <div className="mb-6">
                        <Alert>{error}</Alert>
                    </div>
                )}

                {loading ? (
                    <Card className="sat-arena-card flex min-h-80 items-center justify-center p-8">
                        <div className="flex items-center gap-3 text-slate-500">
                            <Spinner/> Loading leaderboard…
                        </div>
                    </Card>
                ) : entries.length === 0 ? (
                    <EmptyState onRetry={() => fetchLeaderboard(metric)}/>
                ) : (
                    <Card className="sat-arena-card overflow-hidden">
                        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                            <CurrentRankStrip
                                entry={leaderboard.current_user}
                                metric={metric}
                                totalUsers={leaderboard.total_users}
                            />

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="m-0 inline-flex items-center gap-2 text-lg font-black text-slate-900">
                                        <Icon className="size-5 text-slate-400"/> {config.shortLabel}
                                        {isPractice && (
                                            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-700">
                                                {practiceSubject === 'math' ? 'Math' : 'English'}
                                            </span>
                                        )}
                                    </h2>
                                    <p className="m-0 mt-1 text-sm text-slate-500">
                                        Updated from practice answers and duel results.
                                    </p>
                                </div>
                                <span className="text-sm font-semibold text-slate-400">
                                    {leaderboard.total_users} ranked students
                                </span>
                            </div>
                        </div>
                        <div>
                            {entries.map((entry) => (
                                <LeaderboardRow
                                    key={`${metric}-${practiceSubject}-${entry.user.id}`}
                                    entry={entry}
                                    metric={metric}
                                    highlighted={entry.user.id === leaderboard.current_user?.user?.id}
                                />
                            ))}
                        </div>

                        {isPractice && (
                            <div className="flex items-center justify-center gap-3 border-t border-slate-100 px-4 py-4">
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Subject</span>
                                <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
                                    {[['english', 'English'], ['math', 'Math']].map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setPracticeSubject(value)}
                                            className={[
                                                'cursor-pointer rounded-lg px-4 py-1.5 text-sm font-bold transition-colors',
                                                practiceSubject === value
                                                    ? 'bg-sky-600 text-white'
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                                            ].join(' ')}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                )}
            </PageContainer>
        </div>
    );
}

export default RankingPage;
