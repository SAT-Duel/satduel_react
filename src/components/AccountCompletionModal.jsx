import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';
import api from './api';
import {Alert, Button} from './ui';
import {
    MarketingChoice,
    SatDatePicker,
    SetupProgress,
    TermsAgreement,
    UNKNOWN_SAT_DATE,
    useSatExamDates,
} from './AccountSetupFields';
import {useAuth} from '../context/AuthContext';

export default function AccountCompletionGate() {
    const {user} = useAuth();
    const {pathname} = useLocation();

    if (!user?.onboarding_required || ['/login', '/register', '/complete_profile'].includes(pathname)) return null;
    return <AccountCompletionModal/>;
}

function AccountCompletionModal() {
    const {updateUser} = useAuth();
    const [step, setStep] = useState(1);
    const [satExamDate, setSatExamDate] = useState('');
    const [marketingOptIn, setMarketingOptIn] = useState(true);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {dates, loading, error: datesError} = useSatExamDates();

    const continueSetup = () => {
        setError('');
        if (step === 1 && !satExamDate) {
            setError('Choose an SAT date or “I don’t know yet”.');
            return;
        }
        setStep((current) => current + 1);
    };

    const finish = async () => {
        if (!termsAccepted) {
            setError('You must accept the Terms of Service to continue.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const {data} = await api.post('api/auth/complete_profile/', {
                sat_exam_date: satExamDate === UNKNOWN_SAT_DATE ? null : satExamDate,
                marketing_opt_in: marketingOptIn,
                terms_accepted: termsAccepted,
            });
            updateUser({onboarding_required: data.onboarding_required});
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Could not save your choices. Please try again.');
            setSubmitting(false);
        }
    };

    const titles = {
        1: ['Let’s finish setting up your account', 'First, choose your next SAT date.'],
        2: ['SAT Duel updates', 'Choose whether you’d like occasional practice and tournament news.'],
        3: ['Terms and privacy', 'Please review and accept the latest SAT Duel terms.'],
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="account-setup-title">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
                <SetupProgress step={step} labels={['SAT date', 'Updates', 'Terms']}/>
                <h2 id="account-setup-title" className="m-0 text-center font-display text-2xl font-bold text-slate-900">
                    {titles[step][0]}
                </h2>
                <p className="m-0 mb-6 mt-1 text-center text-[15px] text-slate-500">{titles[step][1]}</p>

                {step === 1 && (
                    <>
                        <SatDatePicker dates={dates} value={satExamDate} onChange={setSatExamDate} loading={loading}/>
                        {datesError && <div className="mt-4"><Alert>{datesError}</Alert></div>}
                    </>
                )}
                {step === 2 && <MarketingChoice checked={marketingOptIn} onChange={setMarketingOptIn}/>}
                {step === 3 && <TermsAgreement checked={termsAccepted} onChange={setTermsAccepted}/>}
                {error && <div className="mt-4"><Alert>{error}</Alert></div>}

                <div className="mt-6 flex gap-3">
                    {step > 1 && (
                        <Button type="button" variant="secondary" onClick={() => { setError(''); setStep((current) => current - 1); }}>
                            Back
                        </Button>
                    )}
                    <Button
                        type="button"
                        block
                        loading={submitting}
                        disabled={step === 1 && loading}
                        onClick={step === 3 ? finish : continueSetup}
                    >
                        {step === 3 ? 'Save and continue' : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
