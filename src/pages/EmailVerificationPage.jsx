import React from 'react';
import {CheckCircle2, Mail} from 'lucide-react';
import {useParams} from 'react-router-dom';
import {Button, Card, PageContainer} from '../components/ui';

function EmailVerificationPage() {
    const {email} = useParams();

    return (
        <div className="sat-bubble-field min-h-[calc(100vh-4rem)] py-12 sm:py-16">
            <PageContainer className="max-w-2xl">
                <Card className="sat-arena-card p-6 text-center sm:p-8">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="size-8"/>
                    </div>
                    <h1 className="m-0 mt-5 font-display text-3xl font-black text-slate-950">
                        Verification email sent
                    </h1>
                    <p className="m-0 mt-3 text-lg font-bold text-primary-700">{email}</p>
                    <p className="mx-auto mt-4 max-w-md text-slate-600">
                        Check your inbox and click the verification link to activate your SAT Duel account.
                    </p>
                    <div className="sat-score-strip mt-6 rounded-2xl p-4">
                        <Mail className="mx-auto size-7 text-primary-700"/>
                        <p className="m-0 mt-2 text-sm font-semibold text-slate-600">
                            Do not see it? Check spam, then register again if this is not your email.
                        </p>
                    </div>
                    <Button to="/login" className="mt-6" variant="secondary">
                        Back to login
                    </Button>
                </Card>
            </PageContainer>
        </div>
    );
}

export default EmailVerificationPage;
