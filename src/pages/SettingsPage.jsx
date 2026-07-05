import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Check, Crown, KeyRound, UserCircle} from 'lucide-react';
import withAuth from '../hoc/withAuth';
import api from '../components/api';
import {Alert, Button, Card, Field, Input, PageContainer, Select, Spinner} from '../components/ui';

const AVATAR_COLORS = [
    {key: 'violet', class: 'bg-primary-500'},
    {key: 'sky', class: 'bg-sky-500'},
    {key: 'emerald', class: 'bg-emerald-500'},
    {key: 'amber', class: 'bg-amber-500'},
    {key: 'rose', class: 'bg-rose-500'},
    {key: 'slate', class: 'bg-slate-500'},
];

const GRADES = ['<1', ...Array.from({length: 12}, (_, i) => String(i + 1)), '>12'];

function SettingsPage() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        api.get('api/profile/')
            .then((r) => {
                setProfile(r.data);
                setForm({
                    first_name: r.data.user?.first_name || '',
                    last_name: r.data.user?.last_name || '',
                    biography: r.data.biography || '',
                    grade: r.data.grade || '11',
                    avatar: r.data.avatar || 'violet',
                });
            })
            .catch(() => setNotice({type: 'error', text: 'Could not load your profile.'}));
    }, []);

    const set = (key) => (e) => setForm((f) => ({...f, [key]: e.target.value}));

    const handleSave = async () => {
        setSaving(true);
        setNotice(null);
        try {
            const resp = await api.patch('api/profile/', {
                user: {first_name: form.first_name, last_name: form.last_name},
                biography: form.biography,
                grade: form.grade,
                avatar: form.avatar,
            });
            setProfile(resp.data);
            setNotice({type: 'success', text: 'Settings saved.'});
        } catch (e) {
            setNotice({type: 'error', text: e.response?.data?.error || 'Could not save your settings.'});
        } finally {
            setSaving(false);
        }
    };

    if (!form) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
                <PageContainer className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                        <Spinner/> Loading settings…
                    </div>
                </PageContainer>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 sm:py-14">
            <PageContainer className="max-w-3xl">
                <h1 className="font-display text-3xl font-bold text-slate-900">Account settings</h1>
                <p className="mt-1 text-slate-500">Manage how you appear on SAT Duel.</p>

                {notice && (
                    <div className="mt-5">
                        <Alert type={notice.type}>{notice.text}</Alert>
                    </div>
                )}

                {/* Avatar */}
                <Card className="mt-6 p-6">
                    <h2 className="m-0 inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                        <UserCircle className="size-5 text-slate-400"/> Avatar
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">Pick your color. Your initial does the rest.</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {AVATAR_COLORS.map(({key, class: colorClass}) => {
                            const selected = form.avatar === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setForm((f) => ({...f, avatar: key}))}
                                    aria-label={`${key} avatar`}
                                    className={[
                                        'flex size-14 cursor-pointer items-center justify-center rounded-2xl text-xl font-bold text-white transition-all',
                                        colorClass,
                                        selected ? 'ring-4 ring-primary-300 scale-105' : 'opacity-70 hover:opacity-100',
                                    ].join(' ')}
                                >
                                    {selected
                                        ? <Check className="size-6"/>
                                        : (profile?.user?.username?.[0]?.toUpperCase() || 'A')}
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* Details */}
                <Card className="mt-4 p-6">
                    <h2 className="m-0 text-lg font-bold text-slate-900">Profile details</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <Field label="First name">
                            <Input value={form.first_name} onChange={set('first_name')}/>
                        </Field>
                        <Field label="Last name">
                            <Input value={form.last_name} onChange={set('last_name')}/>
                        </Field>
                    </div>
                    <div className="mt-4">
                        <Field label="Grade">
                            <Select value={form.grade} onChange={set('grade')}>
                                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                            </Select>
                        </Field>
                    </div>
                    <div className="mt-4">
                        <Field label="Bio">
                            <textarea
                                value={form.biography}
                                onChange={set('biography')}
                                rows={3}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500"
                                placeholder="Tell other students something about you…"
                            />
                        </Field>
                    </div>
                    <div className="mt-5">
                        <Button onClick={handleSave} loading={saving}>Save changes</Button>
                    </div>
                </Card>

                {/* Account */}
                <Card className="mt-4 p-6">
                    <h2 className="m-0 text-lg font-bold text-slate-900">Account</h2>
                    <div className="mt-4 space-y-3">
                        <div className="flex flex-col gap-2 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="m-0 font-semibold text-slate-800">Email</p>
                                <p className="m-0 text-sm text-slate-500">{profile?.user?.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="m-0 inline-flex items-center gap-1.5 font-semibold text-slate-800">
                                    <KeyRound className="size-4 text-slate-400"/> Password
                                </p>
                                <p className="m-0 text-sm text-slate-500">Reset it via an email link.</p>
                            </div>
                            <Button to="/password_reset" variant="secondary" size="sm">Change password</Button>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="m-0 inline-flex items-center gap-1.5 font-semibold text-slate-800">
                                    <Crown className="size-4 text-amber-500"/> Plan
                                </p>
                                <p className="m-0 text-sm text-slate-500">
                                    {profile?.is_premium
                                        ? 'Premium — unlimited practice and topic selection.'
                                        : 'Free — daily practice limit, random topics.'}
                                </p>
                            </div>
                            {!profile?.is_premium && (
                                <Button size="sm">
                                    <Crown className="size-4"/> Upgrade
                                </Button>
                            )}
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-400">
                        Looking for your stats? They live on your{' '}
                        <Link to="/profile" className="font-semibold text-primary-600">profile page</Link>.
                    </p>
                </Card>
            </PageContainer>
        </div>
    );
}

export default withAuth(SettingsPage);
