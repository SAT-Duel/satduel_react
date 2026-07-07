import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import api from '../components/api';
import {Button, Card, Field, Input, Select, DividerLabel, Alert} from '../components/ui';
import GoogleLoginButton from '../components/GoogleLogin';
import {DiscordCTA} from '../components/Discord';
import SEO from '../components/SEO';

const GRADES = ['<1', ...Array.from({length: 12}, (_, i) => String(i + 1)), '>12'];

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const USERNAME_RULE = /^[a-zA-Z0-9_]{1,15}$/;
const NAME_RULE = /^[a-zA-Z0-9\s]+$/;

function Register() {
    const [form, setForm] = useState({
        username: '', email: '', first_name: '', last_name: '',
        password: '', confirmPassword: '', grade: '',
    });
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const {loading, user} = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, navigate, loading]);

    const set = (key) => (e) => setForm((f) => ({...f, [key]: e.target.value}));

    const validate = () => {
        const errs = [];
        if (!USERNAME_RULE.test(form.username)) {
            errs.push('Username: up to 15 letters, numbers, or underscores.');
        }
        if (!form.email) errs.push('Email is required.');
        if (!form.first_name || !NAME_RULE.test(form.first_name)) {
            errs.push('First name is required (English letters only).');
        }
        if (!form.last_name || !NAME_RULE.test(form.last_name)) {
            errs.push('Last name is required (English letters only).');
        }
        if (!PASSWORD_RULE.test(form.password)) {
            errs.push('Password: at least 8 characters with an uppercase letter, a lowercase letter, and a number.');
        }
        if (form.password !== form.confirmPassword) {
            errs.push('Passwords do not match.');
        }
        if (!form.grade) errs.push('Please select your grade.');
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (errs.length) return;

        setIsSubmitting(true);
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
            });
            navigate(`/email_verification/${form.email}`);
        } catch (err) {
            const data = err.response?.data || {error: 'An error occurred'};
            setErrors(Object.values(data).flat());
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
            <SEO
                title="Create a SAT Duel Account"
                description="Create a free SAT Duel account to start Digital SAT practice."
                path="/register"
                noindex
            />
            <Card className="w-full max-w-md p-8">
                <h1 className="mb-1 text-center font-display text-2xl font-bold text-slate-900">
                    Create your account
                </h1>
                <p className="mb-6 text-center text-[15px] text-slate-500">
                    Free forever. Start practicing in a minute.
                </p>

                <GoogleLoginButton/>
                <DividerLabel>or sign up with email</DividerLabel>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field label="Username">
                        <Input placeholder="satchampion" value={form.username} onChange={set('username')}/>
                    </Field>
                    <Field label="Email">
                        <Input type="email" placeholder="you@example.com" value={form.email}
                               autoComplete="email" onChange={set('email')}/>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="First name">
                            <Input placeholder="Alex" value={form.first_name} onChange={set('first_name')}/>
                        </Field>
                        <Field label="Last name">
                            <Input placeholder="Kim" value={form.last_name} onChange={set('last_name')}/>
                        </Field>
                    </div>
                    <Field label="Password">
                        <Input type="password" placeholder="••••••••" value={form.password}
                               autoComplete="new-password" onChange={set('password')}/>
                    </Field>
                    <Field label="Confirm password">
                        <Input type="password" placeholder="••••••••" value={form.confirmPassword}
                               autoComplete="new-password" onChange={set('confirmPassword')}/>
                    </Field>
                    <Field label="Grade">
                        <Select value={form.grade} onChange={set('grade')}>
                            <option value="" disabled>Select your grade</option>
                            {GRADES.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </Select>
                    </Field>

                    {errors.length > 0 && (
                        <Alert>
                            {errors.map((e, i) => <div key={i}>{e}</div>)}
                        </Alert>
                    )}

                    <Button type="submit" block loading={isSubmitting}>
                        Create account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                        Log in
                    </Link>
                </p>

                <div className="mt-5">
                    <DiscordCTA variant="banner"/>
                </div>
            </Card>
        </div>
    );
}

export default Register;
