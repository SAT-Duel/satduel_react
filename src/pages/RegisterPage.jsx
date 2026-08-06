import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {MailCheck} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import api from '../components/api';
import {Alert, Button, Card, DividerLabel, Field, Input} from '../components/ui';
import {TermsAgreement} from '../components/AccountSetupFields';
import GoogleLoginButton from '../components/GoogleLogin';
import {DiscordCTA} from '../components/Discord';
import SEO from '../components/SEO';
import {safeRedirectPath} from '../utils/authRedirect';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function Register() {
    const [form, setForm] = useState({
        email: '', password: '', confirmPassword: '',
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {loading, user} = useAuth();
    const rawNext = new URLSearchParams(location.search).get('next');
    const redirectTo = safeRedirectPath(rawNext, '/trainer');

    useEffect(() => {
        if (!loading && user) navigate(redirectTo);
    }, [user, navigate, loading, redirectTo]);

    const set = (key) => (event) => setForm((current) => ({...current, [key]: event.target.value}));

    const validate = () => {
        const nextErrors = [];
        if (!form.email) nextErrors.push('Email is required.');
        if (!PASSWORD_RULE.test(form.password)) {
            nextErrors.push('Password: at least 8 characters with an uppercase letter, a lowercase letter, and a number.');
        }
        if (form.password !== form.confirmPassword) nextErrors.push('Passwords do not match.');
        if (!form.grade) nextErrors.push('Please select your grade.');
        if (!termsAccepted) nextErrors.push('You must accept the Terms of Service to continue.');
        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate();
        setErrors(nextErrors);
        if (nextErrors.length) return;

        setIsSubmitting(true);

        try {
            await api.post('/api/register/', {
                email: form.email,
                password1: form.password,
                password2: form.confirmPassword,
                terms_accepted: termsAccepted,
                next_path: rawNext ? redirectTo : '',
            });
            if (window.gtag) {
                window.gtag('event', 'sign_up_started', {method: 'email'});
            }
            navigate('/email_verification', {state: {email: form.email}});
        } catch (error) {
            const data = error.response?.data || {error: 'An error occurred'};
            setErrors(Object.values(data).flat());
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
            <SEO
                title="Create a SAT Duel Account"
                description="Create a free SAT Duel account to start Digital SAT practice."
                path="/register"
                noindex
            />
            <Card className="w-full max-w-md p-6 sm:p-8">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                    <MailCheck className="size-6"/>
                </div>
                <h1 className="mb-1 text-center font-display text-2xl font-bold text-slate-900">Create your account</h1>
                <p className="mb-6 text-center text-[15px] leading-6 text-slate-500">
                    Verify your email first. Then choose your username and personalize your SAT prep.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <GoogleLoginButton redirectTo={rawNext ? redirectTo : undefined}/>
                    <DividerLabel>or sign up with email</DividerLabel>
                    <Field label="Email">
                        <Input type="email" placeholder="you@example.com" value={form.email} autoComplete="email" onChange={set('email')}/>
                    </Field>
                    <Field label="Password">
                        <Input type="password" placeholder="••••••••" value={form.password} autoComplete="new-password" onChange={set('password')}/>
                        <span className="mt-1.5 block text-xs leading-5 text-slate-400">
                            8+ characters with uppercase, lowercase, and a number.
                        </span>
                    </Field>
                    <Field label="Confirm password">
                        <Input type="password" placeholder="••••••••" value={form.confirmPassword} autoComplete="new-password" onChange={set('confirmPassword')}/>
                    </Field>
                    <TermsAgreement checked={termsAccepted} onChange={setTermsAccepted}/>

                    {errors.length > 0 && (
                        <Alert>{errors.map((error, index) => <div key={index}>{error}</div>)}</Alert>
                    )}

                    <Button type="submit" block loading={isSubmitting}>Send verification email</Button>
                </form>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                    Your account and username are created only after you verify your email.
                </p>
                <p className="mt-5 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link
                        to={rawNext ? `/login?next=${encodeURIComponent(redirectTo)}` : '/login'}
                        className="font-semibold text-primary-600 hover:text-primary-700"
                    >
                        Log in
                    </Link>
                </p>
                <div className="mt-5"><DiscordCTA variant="banner"/></div>
            </Card>
        </div>
    );
}

export default Register;
