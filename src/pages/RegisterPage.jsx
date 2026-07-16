import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import api from '../components/api';
import {Alert, Button, Card, DividerLabel, Field, Input, Select} from '../components/ui';
import {
    MarketingChoice,
    SatDatePicker,
    SetupProgress,
    TermsAgreement,
    UNKNOWN_SAT_DATE,
    useSatExamDates,
} from '../components/AccountSetupFields';
import GoogleLoginButton from '../components/GoogleLogin';
import {DiscordCTA} from '../components/Discord';
import SEO from '../components/SEO';
import {safeRedirectPath} from '../utils/authRedirect';

const GRADES = ['<1', ...Array.from({length: 12}, (_, i) => String(i + 1)), '>12'];
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const USERNAME_RULE = /^[a-zA-Z0-9_]{1,15}$/;
const NAME_RULE = /^[a-zA-Z0-9\s]+$/;

function Register() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        username: '', email: '', first_name: '', last_name: '',
        password: '', confirmPassword: '', grade: '',
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [satExamDate, setSatExamDate] = useState('');
    const [marketingOptIn, setMarketingOptIn] = useState(true);
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {dates, loading: datesLoading, error: datesError} = useSatExamDates();
    const navigate = useNavigate();
    const location = useLocation();
    const {loading, user} = useAuth();
    const rawNext = new URLSearchParams(location.search).get('next');
    const redirectTo = safeRedirectPath(rawNext, '/trainer');

    useEffect(() => {
        if (!loading && user) navigate(redirectTo);
    }, [user, navigate, loading, redirectTo]);

    const set = (key) => (event) => setForm((current) => ({...current, [key]: event.target.value}));

    const accountErrors = () => {
        const nextErrors = [];
        if (!USERNAME_RULE.test(form.username)) nextErrors.push('Username: up to 15 letters, numbers, or underscores.');
        if (!form.email) nextErrors.push('Email is required.');
        if (!form.first_name || !NAME_RULE.test(form.first_name)) nextErrors.push('First name is required (English letters only).');
        if (!form.last_name || !NAME_RULE.test(form.last_name)) nextErrors.push('Last name is required (English letters only).');
        if (!PASSWORD_RULE.test(form.password)) {
            nextErrors.push('Password: at least 8 characters with an uppercase letter, a lowercase letter, and a number.');
        }
        if (form.password !== form.confirmPassword) nextErrors.push('Passwords do not match.');
        if (!form.grade) nextErrors.push('Please select your grade.');
        if (!termsAccepted) nextErrors.push('You must accept the Terms of Service to continue.');
        return nextErrors;
    };

    const continueSetup = () => {
        const nextErrors = step === 1
            ? accountErrors()
            : (!satExamDate ? ['Choose an SAT date or “I don’t know yet”.'] : []);
        setErrors(nextErrors);
        if (!nextErrors.length) setStep((current) => current + 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (step < 3) {
            continueSetup();
            return;
        }

        setIsSubmitting(true);
        setErrors([]);
        if (window.gtag) {
            window.gtag('event', 'sign_up', {
                event_category: 'User Interaction',
                event_label: 'sign_up',
                value: 1,
            });
        }

        try {
            await api.post('/api/register/', {
                username: form.username,
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                password1: form.password,
                password2: form.confirmPassword,
                grade: form.grade,
                sat_exam_date: satExamDate === UNKNOWN_SAT_DATE ? null : satExamDate,
                marketing_opt_in: marketingOptIn,
                terms_accepted: termsAccepted,
            });
            navigate(`/email_verification/${encodeURIComponent(form.email)}`);
        } catch (error) {
            const data = error.response?.data || {error: 'An error occurred'};
            setErrors(Object.values(data).flat());
            setIsSubmitting(false);
        }
    };

    const titles = {
        1: ['Create your account', 'Start with the basics. You can update your profile later.'],
        2: ['When is your next SAT?', 'We’ll use this to put a helpful countdown on your dashboard.'],
        3: ['One last choice', 'Choose which SAT Duel emails you’d like to receive.'],
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
            <SEO
                title="Create a SAT Duel Account"
                description="Create a free SAT Duel account to start Digital SAT practice."
                path="/register"
                noindex
            />
            <Card className="w-full max-w-2xl p-6 sm:p-8">
                <SetupProgress step={step}/>
                <h1 className="mb-1 text-center font-display text-2xl font-bold text-slate-900">{titles[step][0]}</h1>
                <p className="mb-6 text-center text-[15px] text-slate-500">{titles[step][1]}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {step === 1 && (
                        <>
                            <GoogleLoginButton redirectTo={rawNext ? redirectTo : undefined}/>
                            <DividerLabel>or sign up with email</DividerLabel>
                            <Field label="Username">
                                <Input placeholder="satchampion" value={form.username} onChange={set('username')} autoComplete="username"/>
                            </Field>
                            <Field label="Email">
                                <Input type="email" placeholder="you@example.com" value={form.email} autoComplete="email" onChange={set('email')}/>
                            </Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="First name">
                                    <Input placeholder="Alex" value={form.first_name} onChange={set('first_name')} autoComplete="given-name"/>
                                </Field>
                                <Field label="Last name">
                                    <Input placeholder="Kim" value={form.last_name} onChange={set('last_name')} autoComplete="family-name"/>
                                </Field>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Password">
                                    <Input type="password" placeholder="••••••••" value={form.password} autoComplete="new-password" onChange={set('password')}/>
                                </Field>
                                <Field label="Confirm password">
                                    <Input type="password" placeholder="••••••••" value={form.confirmPassword} autoComplete="new-password" onChange={set('confirmPassword')}/>
                                </Field>
                            </div>
                            <Field label="Grade">
                                <Select value={form.grade} onChange={set('grade')}>
                                    <option value="" disabled>Select your grade</option>
                                    {GRADES.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
                                </Select>
                            </Field>
                            <TermsAgreement checked={termsAccepted} onChange={setTermsAccepted}/>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <SatDatePicker
                                dates={dates}
                                value={satExamDate}
                                onChange={setSatExamDate}
                                loading={datesLoading}
                            />
                            {datesError && <Alert>{datesError}</Alert>}
                        </>
                    )}

                    {step === 3 && <MarketingChoice checked={marketingOptIn} onChange={setMarketingOptIn}/>}

                    {errors.length > 0 && (
                        <Alert>{errors.map((error, index) => <div key={index}>{error}</div>)}</Alert>
                    )}

                    <div className="mt-2 flex gap-3">
                        {step > 1 && (
                            <Button type="button" variant="secondary" onClick={() => { setErrors([]); setStep((current) => current - 1); }}>
                                Back
                            </Button>
                        )}
                        <Button type="submit" block loading={isSubmitting} disabled={step === 2 && datesLoading}>
                            {step === 3 ? 'Create account' : 'Continue'}
                        </Button>
                    </div>
                </form>

                {step === 1 && (
                    <>
                        <p className="mt-6 text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link
                                to={rawNext ? `/login?next=${encodeURIComponent(redirectTo)}` : '/login'}
                                className="font-semibold text-primary-600 hover:text-primary-700"
                            >
                                Log in
                            </Link>
                        </p>
                        <div className="mt-5"><DiscordCTA variant="banner"/></div>
                    </>
                )}
            </Card>
        </div>
    );
}

export default Register;
