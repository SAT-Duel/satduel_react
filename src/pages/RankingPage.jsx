import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, Crown, Flame, LineChart, Medal, RefreshCw, Swords, Trophy, Users} from 'lucide-react';
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
        label: 'Streak',
        title: 'Best streak',
        shortLabel: 'Streak',
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

function PodiumCard({entry, metric}) {
    if (!entry) {
        return (
            <Card className="flex min-h-52 items-center justify-center border-dashed p-5 text-center text-slate-400">
                <p className="m-0 text-sm font-semibold">Waiting for more students</p>
            </Card>
        );
    }

    const trophyColor = entry.rank === 1
        ? 'text-amber-500'
        : entry.rank === 2
            ? 'text-slate-400'
            : 'text-orange-500';

    return (
        <Link to={`/profile/${entry.user.id}`} className="block h-full no-underline">
            <Card hover className="h-full p-5 text-center">
                <div className="flex items-center justify-between">
                    <RankBadge rank={entry.rank}/>
                    <Trophy className={`size-6 ${trophyColor}`}/>
                </div>
                <UserAvatar profile={entry} size={entry.rank === 1 ? 'lg' : 'md'} rounded="xl" className="mx-auto mt-5 ring-0"/>
                <p className="m-0 mt-4 truncate text-lg font-black text-slate-900">{entry.user.username}</p>
                <p className="m-0 mt-1 text-sm font-medium text-slate-500">{secondaryLine(entry)}</p>
                <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="m-0 text-3xl font-black text-slate-900">{metricValue(entry, metric)}</p>
                    <p className="m-0 text-xs font-bold text-slate-400">{metricConfig(metric).title}</p>
                </div>
            </Card>
        </Link>
    );
}

function LeaderboardRow({entry, metric, highlighted = false}) {
    const config = metricConfig(metric);
    return (
        <Link
            to={`/profile/${entry.user.id}`}
            className={[
                'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-3 no-underline transition-colors sm:grid-cols-[auto_minmax(0,1fr)_120px_120px_auto]',
                highlighted
                    ? 'border-primary-300 bg-primary-50/70'
                    : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50',
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
                </div>
            </div>
            <div className="hidden sm:block">
                <p className="m-0 text-sm font-bold text-slate-900">{entry.elo_rating}</p>
                <p className="m-0 text-xs font-medium text-slate-400">Duel</p>
            </div>
            <div className="hidden sm:block">
                <p className="m-0 text-sm font-bold text-slate-900">{entry.sp_elo_rating}</p>
                <p className="m-0 text-xs font-medium text-slate-400">Practice</p>
            </div>
            <div className="text-right">
                <p className="m-0 text-xl font-black text-slate-900">{metricValue(entry, metric)}</p>
                <p className="m-0 text-xs font-bold text-slate-400">{config.shortLabel}</p>
            </div>
        </Link>
    );
}

function CurrentRankCard({entry, metric, totalUsers}) {
    if (!entry) return null;
    const percentile = totalUsers > 0
        ? Math.max(1, Math.round(((totalUsers - entry.rank + 1) / totalUsers) * 100))
        : null;

    return (
        <Card className="p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="m-0 text-sm font-bold text-primary-600">Your rank</p>
                    <h2 className="m-0 mt-1 font-display text-3xl font-black text-slate-900">#{entry.rank}</h2>
                </div>
                <UserAvatar profile={entry} size="md" rounded="xl" className="ring-0"/>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="m-0 text-2xl font-black text-slate-900">{metricValue(entry, metric)}</p>
                    <p className="m-0 mt-0.5 text-xs font-bold text-slate-400">{metricConfig(metric).title}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="m-0 text-2xl font-black text-slate-900">{percentile ? `Top ${percentile}%` : '—'}</p>
                    <p className="m-0 mt-0.5 text-xs font-bold text-slate-400">Percentile</p>
                </div>
            </div>
        </Card>
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
    const topThree = entries.slice(0, 3);

    const topAverage = useMemo(() => {
        if (!entries.length) return '—';
        const top = entries.slice(0, Math.min(entries.length, 10));
        const total = top.reduce((sum, entry) => sum + Number(metricValue(entry, metric) || 0), 0);
        return Math.round(total / top.length);
    }, [entries, metric]);

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
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 sm:py-12">
            <PageContainer>
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-sm font-semibold ${config.accent}`}>
                            <Icon className="size-4"/> Leaderboard
                        </span>
                        <h1 className="m-0 mt-4 font-display text-3xl font-black text-slate-900 sm:text-4xl">
                            Global student rankings
                        </h1>
                        <p className="mt-2 max-w-2xl text-slate-600">
                            Ratings and streaks from real SAT Duel practice and duels.
                        </p>
                    </div>
                    <Button to="/infinite_questions" variant="secondary">
                        Practice now <ArrowUpRight className="size-4"/>
                    </Button>
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                    {METRICS.map(({id, label, title, icon: MetricIcon}) => {
                        const selected = metric === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setMetric(id)}
                                className={[
                                    'flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-colors',
                                    selected ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-300',
                                ].join(' ')}
                            >
                                <span className={[
                                    'flex size-11 shrink-0 items-center justify-center rounded-xl',
                                    selected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500',
                                ].join(' ')}>
                                    <MetricIcon className="size-5"/>
                                </span>
                                <span>
                                    <span className="block font-black text-slate-900">{label}</span>
                                    <span className="block text-sm font-medium text-slate-500">{title}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <div className="mb-6">
                        <Alert>{error}</Alert>
                    </div>
                )}

                {loading ? (
                    <Card className="flex min-h-80 items-center justify-center p-8">
                        <div className="flex items-center gap-3 text-slate-500">
                            <Spinner/> Loading leaderboard…
                        </div>
                    </Card>
                ) : entries.length === 0 ? (
                    <EmptyState onRetry={() => fetchLeaderboard(metric)}/>
                ) : (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <main className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                {topThree.map((entry) => (
                                    <PodiumCard key={`podium-${metric}-${entry.user.id}`} entry={entry} metric={metric}/>
                                ))}
                            </div>

                            <Card className="p-4 sm:p-5">
                                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="m-0 text-xl font-black text-slate-900">Full board</h2>
                                    <span className="text-sm font-semibold text-slate-400">
                                        {leaderboard.total_users} ranked students
                                    </span>
                                </div>
                                <div className="space-y-2">
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
                        </main>

                        <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
                            <CurrentRankCard
                                entry={leaderboard.current_user}
                                metric={metric}
                                totalUsers={leaderboard.total_users}
                            />

                            <Card className="p-5">
                                <h2 className="m-0 inline-flex items-center gap-2 text-xl font-black text-slate-900">
                                    <Users className="size-5 text-slate-400"/> Board pulse
                                </h2>
                                <div className="mt-5 grid gap-3">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="m-0 text-2xl font-black text-slate-900">{leaderboard.total_users}</p>
                                        <p className="m-0 mt-0.5 text-xs font-bold text-slate-400">Ranked students</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="m-0 text-2xl font-black text-slate-900">{topAverage}</p>
                                        <p className="m-0 mt-0.5 text-xs font-bold text-slate-400">Top 10 average</p>
                                    </div>
                                </div>
                                <div className="mt-5 flex flex-col gap-3">
                                    <Button to="/match" block>
                                        <Swords className="size-4"/> Start a duel
                                    </Button>
                                    <Button to="/profile" variant="secondary" block>
                                        View profile
                                    </Button>
                                </div>
                            </Card>
                        </aside>
                    </div>
                )}
            </PageContainer>
        </div>
    );
}

export default RankingPage;
