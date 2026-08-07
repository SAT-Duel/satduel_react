import React, {useState} from 'react';
import {Mail} from 'lucide-react';
import {useLocation} from 'react-router-dom';
import api from '../components/api';
import {Button, Card, Field, Input, PageContainer} from '../components/ui';
import {notify} from '../utils/notify';
import SEO from '../components/SEO';
import {useAuth} from '../context/AuthContext';

function getCSRFToken() {
    const name = 'csrftoken';
    if (!document.cookie) return null;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

function PasswordResetPage() {
    const {user} = useAuth();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sentTo, setSentTo] = useState(location.state?.sentTo || '');

    const handlePasswordResetRequest = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = user
                ? await api.post('api/auth/set_password/')
                : await api.post('/api/password_reset/', {email}, {headers: {'X-CSRFToken': getCSRFToken()}});
            if (response.status === 200) {
                setSentTo(user ? response.data.email : email);
            }
        } catch {
            notify.error('Error sending password reset link. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 sm:py-16">
            <SEO
                title="Reset Your SAT Duel Password"
                description="Request a password reset link for your SAT Duel account."
                path="/password_reset"
                noindex
            />
            <PageContainer className="max-w-md">
                <Card className="sat-arena-card p-6 sm:p-8">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                        <Mail className="size-7"/>
                    </div>
                    <h1 className="m-0 mt-5 text-center font-display text-3xl font-black text-slate-950">
                        {sentTo ? 'Check your email' : 'Password reset'}
                    </h1>
                    <p className="m-0 mt-2 text-center text-sm text-slate-500">
                        {sentTo
                            ? <>We sent a secure password link to <strong className="text-slate-700">{sentTo}</strong>.</>
                            : user
                                ? <>We’ll send a secure password link to <strong className="text-slate-700">{user.email}</strong>.</>
                                : 'Enter your account email and we will send a reset link.'}
                    </p>
                    {sentTo ? (
                        <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-center text-sm leading-6 text-primary-800">
                            Open the email and follow the link. It expires in 24 hours and can only be used once.
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordResetRequest} className="mt-6 space-y-4">
                            {!user && (
                                <Field label="Email">
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </Field>
                            )}
                            <Button type="submit" block loading={loading}>
                                Send password link
                            </Button>
                        </form>
                    )}
                </Card>
            </PageContainer>
        </div>
    );
}

export default PasswordResetPage;
