import React, {useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {Check, CreditCard, Crown, KeyRound, Palette, Sparkles} from 'lucide-react';
import withAuth from '../hoc/withAuth';
import api from '../components/api';
import {Alert, Button, Card, Field, Input, PageContainer, Select, Spinner} from '../components/ui';
import {billingErrorMessage, openBillingPortal, startPremiumCheckout} from '../utils/billing';
import UserAvatar from '../components/UserAvatar';
import {AVATAR_BACKGROUNDS, AVATAR_STORY, PIXEL_AVATARS} from '../components/avatarCatalog';
import {useAuth} from '../context/AuthContext';

const GRADES = ['<1', ...Array.from({length: 12}, (_, i) => String(i + 1)), '>12'];

function SettingsPage() {
    const [searchParams] = useSearchParams();
    const {updateUser} = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [billingAction, setBillingAction] = useState(null);
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
                    avatar_icon: r.data.avatar_icon || 'initial',
                });
            })
            .catch(() => setNotice({type: 'error', text: 'Could not load your profile.'}));
    }, []);

    useEffect(() => {
        const checkout = searchParams.get('checkout');
        if (checkout === 'success') {
            setNotice({
                type: 'success',
                text: 'Payment received. Premium access may take a moment to appear while Stripe confirms it.',
            });
        } else if (checkout === 'cancelled') {
            setNotice({type: 'error', text: 'Checkout was cancelled.'});
        }
    }, [searchParams]);

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
                avatar_icon: form.avatar_icon,
            });
            setProfile(resp.data);
            updateUser({
                avatar: resp.data.avatar,
                avatar_icon: resp.data.avatar_icon,
                is_premium: resp.data.is_premium,
                username: resp.data.user?.username,
                email: resp.data.user?.email,
            });
            setNotice({type: 'success', text: 'Settings saved.'});
        } catch (e) {
            setNotice({type: 'error', text: e.response?.data?.error || 'Could not save your settings.'});
        } finally {
            setSaving(false);
        }
    };

    const handleUpgrade = async () => {
        setBillingAction('checkout');
        setNotice(null);
        try {
            await startPremiumCheckout();
        } catch (e) {
            setNotice({type: 'error', text: billingErrorMessage(e, 'Could not start checkout.')});
            setBillingAction(null);
        }
    };

    const handleManageBilling = async () => {
        setBillingAction('portal');
        setNotice(null);
        try {
            await openBillingPortal();
        } catch (e) {
            setNotice({type: 'error', text: billingErrorMessage(e, 'Could not open billing settings.')});
            setBillingAction(null);
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
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="m-0 inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                                <Sparkles className="size-5 text-primary-500"/> Avatar
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Choose a Prism Archive character, or keep the classic initial mark.
                            </p>
                        </div>
                        <UserAvatar
                            profile={profile}
                            backgroundId={form.avatar}
                            iconId={form.avatar_icon}
                            size="lg"
                            className="mx-auto ring-primary-100 sm:mx-0"
                        />
                    </div>

                    <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
                        <p className="m-0 text-sm font-bold text-primary-800">{AVATAR_STORY.title}</p>
                        <p className="m-0 mt-1 text-sm leading-relaxed text-primary-700">{AVATAR_STORY.text}</p>
                    </div>

                    <div className="mt-6">
                        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Palette className="size-4 text-slate-400"/> Background color
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {AVATAR_BACKGROUNDS.map((background) => {
                                const selected = form.avatar === background.id;
                                return (
                                    <button
                                        key={background.id}
                                        type="button"
                                        onClick={() => setForm((f) => ({...f, avatar: background.id}))}
                                        aria-label={`${background.label} avatar background`}
                                        className={[
                                            'flex size-14 cursor-pointer items-center justify-center rounded-2xl border-2 transition-all',
                                            background.classes,
                                            selected ? 'border-primary-700 ring-4 ring-primary-200 scale-105' : 'border-transparent opacity-80 hover:opacity-100',
                                        ].join(' ')}
                                    >
                                        {selected && <Check className="size-6"/>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-3 text-sm font-semibold text-slate-700">Character</p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {PIXEL_AVATARS.map((avatar) => {
                                const selected = form.avatar_icon === avatar.id;
                                const previewProfile = {
                                    ...profile,
                                    avatar: form.avatar,
                                    avatar_icon: avatar.id,
                                };
                                return (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => setForm((f) => ({...f, avatar_icon: avatar.id}))}
                                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${
                                            selected
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <UserAvatar
                                            profile={previewProfile}
                                            size="md"
                                            className="ring-0"
                                        />
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-bold text-slate-800">{avatar.label}</span>
                                            <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">{avatar.tagline}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
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
                            {profile?.is_premium ? (
                                <Button
                                    onClick={handleManageBilling}
                                    loading={billingAction === 'portal'}
                                    variant="secondary"
                                    size="sm"
                                >
                                    <CreditCard className="size-4"/> Manage billing
                                </Button>
                            ) : (
                                <Button onClick={handleUpgrade} loading={billingAction === 'checkout'} size="sm">
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
