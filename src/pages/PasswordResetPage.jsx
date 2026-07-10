import React, {useState} from 'react';
import {Mail} from 'lucide-react';
import api from '../components/api';
import {Button, Card, Field, Input, PageContainer} from '../components/ui';
import {notify} from '../utils/notify';
import SEO from '../components/SEO';

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
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordResetRequest = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await api.post(`${baseUrl}/api/password_reset/`, {email}, {
                headers: {'X-CSRFToken': getCSRFToken()},
            });
            if (response.status === 200) {
                notify.success('Password reset link sent to your email.');
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
                        Password reset
                    </h1>
                    <p className="m-0 mt-2 text-center text-sm text-slate-500">
                        Enter your account email and we will send a reset link.
                    </p>
                    <form onSubmit={handlePasswordResetRequest} className="mt-6 space-y-4">
                        <Field label="Email">
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </Field>
                        <Button type="submit" block loading={loading}>
                            Send reset link
                        </Button>
                    </form>
                </Card>
            </PageContainer>
        </div>
    );
}

export default PasswordResetPage;
