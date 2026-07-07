import React, {useState} from 'react';
import {LockKeyhole} from 'lucide-react';
import {useParams, useNavigate} from 'react-router-dom';
import api from '../components/api';
import {Button, Card, Field, Input, PageContainer} from '../components/ui';
import {notify} from '../utils/notify';
import SEO from '../components/SEO';

function PasswordResetConfirmPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {uidb64, token} = useParams();
    const navigate = useNavigate();

    const handlePasswordResetConfirm = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            notify.error('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await api.post(`${baseUrl}/api/reset/${uidb64}/${token}/`, {
                new_password1: password,
                new_password2: confirmPassword,
            });

            if (response.status === 200) {
                notify.success('Password reset successful.');
                navigate('/login');
            } else {
                notify.error('Invalid token or link expired.');
            }
        } catch {
            notify.error('Error resetting password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sat-bubble-field min-h-screen py-12 sm:py-16">
            <SEO
                title="Set a New SAT Duel Password"
                description="Choose a new password for your SAT Duel account."
                path="/api/reset"
                noindex
            />
            <PageContainer className="max-w-md">
                <Card className="sat-arena-card p-6 sm:p-8">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                        <LockKeyhole className="size-7"/>
                    </div>
                    <h1 className="m-0 mt-5 text-center font-display text-3xl font-black text-slate-950">
                        Set new password
                    </h1>
                    <form onSubmit={handlePasswordResetConfirm} className="mt-6 space-y-4">
                        <Field label="New password">
                            <Input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Confirm password">
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                required
                            />
                        </Field>
                        <Button type="submit" block loading={loading}>
                            Reset password
                        </Button>
                    </form>
                </Card>
            </PageContainer>
        </div>
    );
}

export default PasswordResetConfirmPage;
