import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import {Alert, Button, Card, Spinner} from './ui';
import SEO from './SEO';
import {useAuth} from '../context/AuthContext';
import {rememberPostLoginRedirect, safeRedirectPath} from '../utils/authRedirect';

function ConfirmEmail() {
    const {key} = useParams();
    const navigate = useNavigate();
    const {login} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL;
                try {
                    const {data} = await axios.post(`${baseUrl}/api/auth/verify-registration/`, {key});
                    const {next_path: nextPath, ...userData} = data.user;
                    await login(userData, data.access, data.refresh);
                    if (nextPath) rememberPostLoginRedirect(safeRedirectPath(nextPath, '/trainer'));
                    if (window.gtag) window.gtag('event', 'sign_up', {method: 'email'});
                    navigate('/complete_profile', {replace: true});
                    return;
                } catch (pendingError) {
                    try {
                        await axios.post(`${baseUrl}/auth/registration/verify-email/`, {key});
                        navigate('/login?verified=1', {replace: true});
                        return;
                    } catch {
                        setError(pendingError.response?.data?.error || 'This verification link is invalid or expired.');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, [key, login, navigate]);

    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <SEO
                title="Confirm Your SAT Duel Email"
                description="Confirm your SAT Duel account email."
                path="/confirm-email"
                noindex
            />
            {loading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                    <Spinner/> Confirming email…
                </div>
            ) : error && (
                <Card className="mx-4 w-full max-w-md p-6 text-center sm:p-8">
                    <h1 className="m-0 font-display text-2xl font-bold text-slate-900">We could not verify this link</h1>
                    <div className="mt-4 text-left"><Alert>{error}</Alert></div>
                    <Button to="/register" className="mt-5" block>Send a new verification email</Button>
                    <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700">
                        Back to login
                    </Link>
                </Card>
            )}
        </div>
    );
}

export default ConfirmEmail;
