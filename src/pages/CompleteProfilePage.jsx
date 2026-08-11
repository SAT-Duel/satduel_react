import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useNavigate} from 'react-router-dom';
import {CalendarDays, Check, ShieldCheck, UserRound} from 'lucide-react';
import api from '../components/api';
import {Alert, Button, Field, Input, Select} from '../components/ui';
import {
    MarketingChoice,
    SatDatePicker,
    SetupProgress,
    TermsAgreement,
    UNKNOWN_SAT_DATE,
    useOnboardingPreferences,
    useSatExamDates,
} from '../components/AccountSetupFields';
import {useAuth} from '../context/AuthContext';
import withAuth from '../hoc/withAuth';
import useSdTheme from '../hooks/useSdTheme';
import '../styles/landing.css';

const GRADES = [...Array.from({length: 5}, (_, i) => String(i + 8)), '>12'];
const USERNAME_RULE = /^[a-zA-Z0-9_]{1,15}$/;

const CompleteProfilePage = () => {
    const [theme] = useSdTheme();
    const {user, updateUser} = useAuth();
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState(user?.username || '');
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [grade, setGrade] = useState(user?.grade_selected ? user.grade : '');
    const [satExamDate, setSatExamDate] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {dates, loading: datesLoading, error: datesError} = useSatExamDates();
    const {
        marketingOptIn,
        setMarketingOptIn,
        termsAccepted,
        setTermsAccepted,
        preferencesReady,
        preferencesError,
    } = useOnboardingPreferences(user);
    const navigate = useNavigate();

    const continueSetup = () => {
        setError('');
        if (!USERNAME_RULE.test(username)) {
            setError('Use 1–15 letters, numbers, or underscores for your username.');
            return;
        }
        if (!firstName.trim() || !lastName.trim()) {
            setError('Enter your first and last name.');
            return;
        }
        if (!grade) {
            setError('Please select your grade.');
            return;
        }
        if (!termsAccepted) {
            setError('You must accept the Terms of Service to continue.');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (step === 1) {
            continueSetup();
            return;
        }
        if (!satExamDate) {
            setError('Choose an SAT date or “I don’t know yet”.');
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            const {data} = await api.post('api/auth/complete_profile/', {
                username,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                grade,
                sat_exam_date: satExamDate === UNKNOWN_SAT_DATE ? null : satExamDate,
                marketing_opt_in: marketingOptIn,
                terms_accepted: termsAccepted,
            });
            updateUser({
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                onboarding_required: data.onboarding_required,
                terms_accepted: true,
            });
            navigate('/welcome', {replace: true});
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Could not save your profile. Please try again.');
            setSubmitting(false);
        }
    };

    const titles = {
        1: ['Make SAT Duel yours', 'Set the identity other students will see, then review your account choices.'],
        2: ['Put your SAT on the calendar', 'Choose a test date for a useful countdown, or tell us you are still deciding.'],
    };

    return (
        <div className="sd-landing min-h-screen px-4 py-6 sm:px-6 sm:py-10" data-theme={theme}>
            <Helmet><title>Complete profile | SAT Duel</title></Helmet>
            <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--sd-line2)] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.28)] lg:min-h-[680px] lg:grid-cols-[0.82fr_1.18fr]">
                <aside className="relative overflow-hidden bg-[#111a2d] px-6 py-8 text-white sm:px-9 sm:py-10 lg:flex lg:flex-col lg:justify-between lg:p-11">
                    <div className="absolute -right-8 -top-6 grid grid-cols-2 gap-3 opacity-20" aria-hidden="true">
                        {['A', 'B', 'C', 'D'].map((choice) => (
                            <span key={choice} className="flex size-14 items-center justify-center rounded-full border-2 border-white text-sm font-black">
                                {choice}
                            </span>
                        ))}
                    </div>
                    <div className="relative max-w-md">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                            {step === 1 ? <UserRound className="size-6"/> : <CalendarDays className="size-6"/>}
                        </span>
                        <h1 className="m-0 mt-6 max-w-sm font-display text-3xl font-bold tracking-[-0.025em] sm:text-4xl">
                            {titles[step][0]}
                        </h1>
                        <p className="m-0 mt-3 max-w-sm text-[15px] leading-6 text-slate-300">
                            {titles[step][1]}
                        </p>
                    </div>

                    <ol className="relative mt-12 hidden gap-3 lg:grid" aria-label="Account setup progress">
                        {[
                            ['About you', UserRound],
                            ['SAT date', CalendarDays],
                        ].map(([label, Icon], index) => {
                            const number = index + 1;
                            const active = number === step;
                            const complete = number < step;
                            return (
                                <li key={label} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${active ? 'bg-white/10' : ''}`}>
                                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-black ${complete ? 'border-emerald-300 bg-emerald-400 text-emerald-950' : active ? 'border-cyan-300 text-cyan-200' : 'border-slate-600 text-slate-400'}`}>
                                        {complete ? <Check className="size-4"/> : number}
                                    </span>
                                    <span className={active || complete ? 'font-bold text-white' : 'font-semibold text-slate-400'}>{label}</span>
                                </li>
                            );
                        })}
                    </ol>
                </aside>

                <section className="flex flex-col justify-center px-5 py-7 sm:px-9 sm:py-9 lg:px-12 lg:py-11">
                    <div className="lg:hidden">
                        <SetupProgress step={step} labels={['About you', 'SAT date']}/>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {step === 1 && (
                        <>
                            <Field label="Username">
                                <Input
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    maxLength={15}
                                    autoComplete="username"
                                />
                                <span className="mt-1.5 block text-xs text-slate-400">
                                    This is public. Use 1–15 letters, numbers, or underscores.
                                </span>
                            </Field>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="First name">
                                    <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name"/>
                                </Field>
                                <Field label="Last name">
                                    <Input value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name"/>
                                </Field>
                            </div>
                            {!user?.grade_selected && (
                                <Field label="Grade">
                                    <Select value={grade} onChange={(event) => setGrade(event.target.value)}>
                                        <option value="" disabled>Select your grade</option>
                                        {GRADES.map((value) => <option key={value} value={value}>{value}</option>)}
                                    </Select>
                                </Field>
                            )}
                            <div className="mt-2 space-y-3 border-t border-slate-200 pt-5">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-5 text-primary-600"/>
                                    <h2 className="m-0 text-base font-bold text-slate-900">Privacy and updates</h2>
                                </div>
                                {!user?.terms_accepted && (
                                    <TermsAgreement checked={termsAccepted} onChange={setTermsAccepted}/>
                                )}
                                <MarketingChoice checked={marketingOptIn} onChange={setMarketingOptIn}/>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <SatDatePicker dates={dates} value={satExamDate} onChange={setSatExamDate} loading={datesLoading}/>
                            {datesError && <Alert>{datesError}</Alert>}
                        </>
                    )}

                    {!preferencesReady && !preferencesError && (
                        <p className="m-0 text-sm font-semibold text-slate-500">Loading your account choices…</p>
                    )}
                    {preferencesError && <Alert>{preferencesError}</Alert>}
                    {error && <Alert>{error}</Alert>}

                    <div className="mt-2 flex gap-3">
                        {step > 1 && (
                            <Button type="button" variant="secondary" onClick={() => { setError(''); setStep((current) => current - 1); }}>
                                Back
                            </Button>
                        )}
                        <Button type="submit" block loading={submitting} disabled={!preferencesReady || (step === 2 && datesLoading)}>
                            {step === 2 ? 'Finish setup' : 'Continue'}
                        </Button>
                    </div>
                </form>
                </section>
            </div>
        </div>
    );
};

export default withAuth(CompleteProfilePage);
