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

function RankBadge({rank}) {
    const podiumStyles = {
        1: 'bg-amber-100 text-amber-800 border-amber-200',
        2: 'bg-slate-100 text-slate-700 border-slate-200',
        3: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return (
        <span className={[
            'inline-flex size-10 shrink-0 items-center justify-center rounded-xl border text-sm font-black',
            podiumStyles[rank] || 'border-slate-200 bg-white text-slate-500',
        ].join(' ')}>
            #{rank}
        </span>
    );
}

function LeaderboardRow({entry, metric, highlighted = false}) {
    return (
        <Link
            to={`/profile/${entry.user.id}`}
            className={[
                'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-100 px-4 py-3 no-underline transition-colors last:border-b-0 sm:px-5',
                highlighted
                    ? 'bg-primary-50/70'
                    : 'bg-white hover:bg-slate-50',
            ].join(' ')}
        >
            <RankBadge rank={entry.rank}/>
            <div className="flex min-w-0 items-center gap-3">
                <UserAvatar profile={entry} size="sm" className="ring-0"/>
                <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                        <p className="m-0 truncate font-bold text-slate-900">{entry.user.username}</p>
                        {entry.is_premium && <Crown className="size-4 shrink-0 text-amber-500"/>}
                    </div>
                    <p className="m-0 mt-0.5 truncate text-sm text-slate-500">{secondaryLine(entry)}</p>
                    <p className="m-0 mt-1 hidden truncate text-xs font-medium text-slate-400 sm:block">
                        Duel {entry.elo_rating} · Practice {entry.sp_elo_rating} · Best correct streak {entry.max_streak}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="m-0 text-lg font-black text-slate-900 sm:text-xl">{metricValue(entry, metric)}</p>
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

function RankingPage() {
    const [metric, setMetric] = useState('duel');
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const config = metricConfig(metric);
    const Icon = config.icon;
    const entries = leaderboard?.entries || [];

    const fetchLeaderboard = async (nextMetric = metric) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/leaderboard/', {
                params: {metric: nextMetric, limit: 50},
            });
            setLeaderboard(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Could not load the leaderboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard(metric);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metric]);

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-6 sm:py-8">
            <PageContainer>
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="m-0 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                            Leaderboard
                        </h1>
                        <p className="m-0 mt-1 text-sm text-slate-500">
                            Ranked by {config.title.toLowerCase()}.
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
                                    key={`${metric}-${entry.user.id}`}
                                    entry={entry}
                                    metric={metric}
                                    highlighted={entry.user.id === leaderboard.current_user?.user?.id}
                                />
                            ))}
                        </div>
                    </Card>
                )}
            </PageContainer>
        </div>
    );
}

export default RankingPage;
