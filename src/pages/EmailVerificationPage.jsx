import React from 'react';
import {CheckCircle2, Mail} from 'lucide-react';
import {useLocation, useParams} from 'react-router-dom';
import {Button, Card, PageContainer} from '../components/ui';
import SEO from '../components/SEO';

function EmailVerificationPage() {
    const {email: legacyEmail} = useParams();
    const {state} = useLocation();
    const email = state?.email || legacyEmail;

    return (
        <div className="min-h-[calc(100vh-4rem)] py-12 sm:py-16">
            <SEO
                title="Verify Your SAT Duel Email"
                description="Check your email to activate your SAT Duel account."
                path="/email_verification"
                noindex
            />
            <PageContainer className="max-w-2xl">
                <Card className="sat-arena-card p-6 text-center sm:p-8">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="size-8"/>
                    </div>
                    <h1 className="m-0 mt-5 font-display text-3xl font-black text-slate-950">
                        Verification email sent
                    </h1>
                    {email && <p className="m-0 mt-3 break-all text-base font-bold text-primary-700 sm:text-lg">{email}</p>}
                    <p className="mx-auto mt-4 max-w-md text-slate-600">
                        Check your inbox and click the verification link to activate your SAT Duel account.
                    </p>
                    <div className="sat-score-strip mt-6 rounded-2xl p-4">
                        <Mail className="mx-auto size-7 text-primary-700"/>
                        <p className="m-0 mt-2 text-sm font-semibold text-slate-600">
                            Do not see it? Check spam. After one minute, submit the signup form again to receive a fresh link.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button to="/register" variant="secondary">Use a different email</Button>
                        <Button to="/login" variant="secondary">Already verified? Log in</Button>
                    </div>
                </Card>
            </PageContainer>
        </div>
    );
}

export default EmailVerificationPage;
