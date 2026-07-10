import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import {Button, Card, Field, Input, DividerLabel, Alert} from "../components/ui";
import GoogleLoginButton from "../components/GoogleLogin";
import {DiscordCTA} from "../components/Discord";
import SEO from '../components/SEO';
import {rememberPostLoginRedirect, safeRedirectPath} from '../utils/authRedirect';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {login, loading, user} = useAuth();
    const rawNext = new URLSearchParams(location.search).get('next');
    const redirectTo = safeRedirectPath(rawNext, '/trainer');
    const isTournamentInvite = redirectTo.startsWith('/tournament');

    useEffect(() => {
        if (!loading && user) {
            navigate(redirectTo);
        }
    }, [user, navigate, loading, redirectTo]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please enter your username/email and password.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            // Single request: authenticate and receive tokens + user together.
            const response = await axios.post(`${baseUrl}/api/auth/login/`, {
                username,
                password,
                timezone: userTimezone
            });
            const {access, refresh, user: userData} = response.data;
            await login(userData, access, refresh);
            if (rawNext && userData.is_first_login) {
                rememberPostLoginRedirect(redirectTo);
            }
            if (userData.is_first_login) {
                navigate('/welcome');
            } else {
                navigate(redirectTo);
            }
        } catch (err) {
            const msg = err.response?.data?.error;
            setError(msg || (err.response?.status === 401
                ? 'Invalid username or password'
                : 'An error occurred during login'));
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
            <SEO
                title="Log in to SAT Duel"
                description={isTournamentInvite ? 'Log in to open your SAT Duel tournament invite.' : 'Log in to continue your SAT Duel practice.'}
                path="/login"
                noindex
            />
            <Card className="w-full max-w-md p-8">
                <h1 className="mb-1 text-center font-display text-2xl font-bold text-slate-900">
                    Welcome back
                </h1>
                <p className="mb-6 text-center text-[15px] text-slate-500">
                    {isTournamentInvite ? 'Log in and we will take you straight to the tournament.' : 'Log in to continue your prep.'}
                </p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Field label="Username or email">
                        <Input
                            placeholder="you@example.com"
                            value={username}
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Field>
                    <Field label="Password">
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field>

                    {error && <Alert>{error}</Alert>}

                    <Button type="submit" block loading={isSubmitting}>
                        Log in
                    </Button>
                </form>

                <DividerLabel>or</DividerLabel>
                <GoogleLoginButton redirectTo={rawNext ? redirectTo : undefined}/>

                <div className="mt-6 flex flex-col gap-1 text-center text-sm text-slate-500">
                    <span>
                        Forgot your password?{' '}
                        <Link to="/password_reset" className="font-semibold text-primary-600 hover:text-primary-700">
                            Reset it
                        </Link>
                    </span>
                    <span>
                        New here?{' '}
                        <Link
                            to={rawNext ? `/register?next=${encodeURIComponent(redirectTo)}` : '/register'}
                            className="font-semibold text-primary-600 hover:text-primary-700"
                        >
                            Create an account
                        </Link>
                    </span>
                </div>

                <div className="mt-6">
                    <DiscordCTA variant="banner"/>
                </div>
            </Card>
        </div>
    );
}

export default Login;
