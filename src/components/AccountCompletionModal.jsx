import React, {useEffect, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import api from './api';
import {Alert, Button, Spinner} from './ui';
import {
    MarketingChoice,
    SatDatePicker,
    SetupProgress,
    TermsAgreement,
    UNKNOWN_SAT_DATE,
    useOnboardingPreferences,
    useSatExamDates,
} from './AccountSetupFields';
import {useAuth} from '../context/AuthContext';
import {incompleteOnboardingSections, needsFullOnboarding} from '../utils/onboarding';

export default function AccountCompletionGate() {
    const {user, refreshUser} = useAuth();
    const {pathname} = useLocation();
    const [checkedUserId, setCheckedUserId] = useState(null);
    const excluded = ['/login', '/register', '/complete_profile'].includes(pathname);
    const gradeUnknown = user?.onboarding_required && typeof user.grade_selected !== 'boolean';

    useEffect(() => {
        if (!gradeUnknown || excluded || checkedUserId === user.id) return;
        refreshUser()
            .catch(() => {})
            .finally(() => setCheckedUserId(user.id));
    }, [checkedUserId, excluded, gradeUnknown, refreshUser, user?.id]);

    if (!user?.onboarding_required || excluded) return null;
    if (gradeUnknown && checkedUserId !== user.id) {
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-white" aria-label="Checking account setup">
                <Spinner/>
            </div>
        );
    }
    if (needsFullOnboarding(user)) return <Navigate to="/complete_profile" replace/>;
    return <AccountCompletionModal/>;
}

function AccountCompletionModal() {
    const {user, updateUser} = useAuth();
    const sections = incompleteOnboardingSections(user);
    const [step, setStep] = useState(0);
    const [satExamDate, setSatExamDate] = useState(
        user?.sat_exam_date_selected ? (user.sat_exam_date || UNKNOWN_SAT_DATE) : ''
    );
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {dates, loading, error: datesError} = useSatExamDates();
    const {
        marketingOptIn,
        setMarketingOptIn,
        termsAccepted,
        setTermsAccepted,
        preferencesReady,
        preferencesError,
    } = useOnboardingPreferences(user);

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
            updateUser({
                onboarding_required: data.onboarding_required,
                sat_exam_date: data.sat_exam_date,
                sat_exam_date_selected: true,
                terms_accepted: true,
                marketing_opt_in: marketingOptIn,
            });
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Could not save your choices. Please try again.');
            setSubmitting(false);
        }
    };

    const continueSetup = () => {
        setError('');
        if (sections[step] === 'sat-date' && !satExamDate) {
            setError('Choose an SAT date or “I don’t know yet”.');
            return;
        }
        if (step < sections.length - 1) {
            setStep((current) => current + 1);
            return;
        }
        finish();
    };

    const titles = {
        'sat-date': ['Let’s finish setting up your account', 'Choose your next SAT date.'],
        privacy: ['Privacy and updates', 'Review the latest terms and choose whether you want occasional SAT Duel emails.'],
    };
    const currentSection = sections[step] || 'privacy';
    const labels = sections.map((section) => section === 'sat-date' ? 'SAT date' : 'Privacy');

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="account-setup-title">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
                <SetupProgress step={step + 1} labels={labels}/>
                <h2 id="account-setup-title" className="m-0 text-center font-display text-2xl font-bold text-slate-900">
                    {titles[currentSection][0]}
                </h2>
                <p className="m-0 mb-6 mt-1 text-center text-[15px] text-slate-500">{titles[currentSection][1]}</p>

                {currentSection === 'sat-date' && (
                    <>
                        <SatDatePicker dates={dates} value={satExamDate} onChange={setSatExamDate} loading={loading}/>
                        {datesError && <div className="mt-4"><Alert>{datesError}</Alert></div>}
                    </>
                )}
                {currentSection === 'privacy' && (
                    <div className="space-y-4">
                        {!user?.terms_accepted && (
                            <TermsAgreement checked={termsAccepted} onChange={setTermsAccepted}/>
                        )}
                        {typeof user?.marketing_opt_in !== 'boolean' && (
                            <MarketingChoice checked={marketingOptIn} onChange={setMarketingOptIn}/>
                        )}
                    </div>
                )}
                {!preferencesReady && !preferencesError && (
                    <p className="m-0 mt-4 text-sm font-semibold text-slate-500">Loading your account choices…</p>
                )}
                {preferencesError && <div className="mt-4"><Alert>{preferencesError}</Alert></div>}
                {error && <div className="mt-4"><Alert>{error}</Alert></div>}

                <div className="mt-6 flex gap-3">
                    {step > 0 && (
                        <Button type="button" variant="secondary" onClick={() => { setError(''); setStep((current) => current - 1); }}>
                            Back
                        </Button>
                    )}
                    <Button
                        type="button"
                        block
                        loading={submitting}
                        disabled={!preferencesReady || (currentSection === 'sat-date' && loading)}
                        onClick={continueSetup}
                    >
                        {step === sections.length - 1 ? 'Save and continue' : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
