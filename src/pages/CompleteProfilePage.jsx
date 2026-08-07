import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useNavigate} from 'react-router-dom';
import api from '../components/api';
import {Alert, Button, Card, Field, Input, Select} from '../components/ui';
import {
    MarketingChoice,
    SatDatePicker,
    SetupProgress,
    TermsAgreement,
    UNKNOWN_SAT_DATE,
    useSatExamDates,
} from '../components/AccountSetupFields';
import {useAuth} from '../context/AuthContext';
import withAuth from '../hoc/withAuth';
import useSdTheme from '../hooks/useSdTheme';
import '../styles/landing.css';

const GRADES = ['<1', ...Array.from({length: 12}, (_, i) => String(i + 1)), '>12'];
const USERNAME_RULE = /^[a-zA-Z0-9_]{1,15}$/;

const CompleteProfilePage = () => {
    const [theme] = useSdTheme();
    const {user, updateUser} = useAuth();
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState(user?.username || '');
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [grade, setGrade] = useState(user?.grade_selected ? user.grade : '');
    const [termsAccepted, setTermsAccepted] = useState(Boolean(user?.terms_accepted));
    const [satExamDate, setSatExamDate] = useState('');
    const [marketingOptIn, setMarketingOptIn] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {dates, loading: datesLoading, error: datesError} = useSatExamDates();
    const navigate = useNavigate();

    const continueSetup = () => {
        setError('');
        if (step === 1) {
            if (!USERNAME_RULE.test(username)) {
                setError('Use 1–15 letters, numbers, or underscores for your username.');
                return;
            }
            if (!firstName.trim() || !lastName.trim()) {
                setError('Enter your first and last name.');
                return;
            }
            if (!grade) {
                setError('Please select your grade.');
                return;
            }
            if (!termsAccepted) {
                setError('You must accept the Terms of Service to continue.');
                return;
            }
        }
        if (step === 2 && !satExamDate) {
            setError('Choose an SAT date or “I don’t know yet”.');
            return;
        }
        setStep((current) => current + 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (step < 3) {
            continueSetup();
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            const {data} = await api.post('api/auth/complete_profile/', {
                username,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                grade,
                sat_exam_date: satExamDate === UNKNOWN_SAT_DATE ? null : satExamDate,
                marketing_opt_in: marketingOptIn,
                terms_accepted: termsAccepted,
            });
            updateUser({
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                onboarding_required: data.onboarding_required,
                terms_accepted: true,
            });
            navigate('/welcome');
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Could not save your profile. Please try again.');
            setSubmitting(false);
        }
    };

    const titles = {
        1: ['Welcome to SAT Duel!', 'Choose your public username and tell us a little about you.'],
        2: ['When is your next SAT?', 'We’ll use this to put a helpful countdown on your dashboard.'],
        3: ['One last choice', 'Choose which SAT Duel emails you’d like to receive.'],
    };

    return (
        <div className="sd-landing flex min-h-screen items-center justify-center px-4 py-10" data-theme={theme}>
            <Helmet><title>Complete profile | SAT Duel</title></Helmet>
            <Card className="w-full max-w-2xl p-6 sm:p-8">
                <SetupProgress step={step}/>
                <h1 className="mb-1 text-center font-display text-2xl font-bold text-slate-900">{titles[step][0]}</h1>
                <p className="mb-6 text-center text-[15px] text-slate-500">{titles[step][1]}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {step === 1 && (
                        <>
                            <Field label="Username">
                                <Input
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    maxLength={15}
                                    autoComplete="username"
                                />
                                <span className="mt-1.5 block text-xs text-slate-400">
                                    This is public. Use 1–15 letters, numbers, or underscores.
                                </span>
                            </Field>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="First name">
                                    <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name"/>
                                </Field>
                                <Field label="Last name">
                                    <Input value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name"/>
                                </Field>
                            </div>
                            {!user?.grade_selected && (
                                <Field label="Grade">
                                    <Select value={grade} onChange={(event) => setGrade(event.target.value)}>
                                        <option value="" disabled>Select your grade</option>
                                        {GRADES.map((value) => <option key={value} value={value}>{value}</option>)}
                                    </Select>
                                </Field>
                            )}
                            {!user?.terms_accepted && <TermsAgreement checked={termsAccepted} onChange={setTermsAccepted}/>}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <SatDatePicker dates={dates} value={satExamDate} onChange={setSatExamDate} loading={datesLoading}/>
                            {datesError && <Alert>{datesError}</Alert>}
                        </>
                    )}

                    {step === 3 && <MarketingChoice checked={marketingOptIn} onChange={setMarketingOptIn}/>}
                    {error && <Alert>{error}</Alert>}

                    <div className="mt-2 flex gap-3">
                        {step > 1 && (
                            <Button type="button" variant="secondary" onClick={() => { setError(''); setStep((current) => current - 1); }}>
                                Back
                            </Button>
                        )}
                        <Button type="submit" block loading={submitting} disabled={step === 2 && datesLoading}>
                            {step === 3 ? 'Finish setup' : 'Continue'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default withAuth(CompleteProfilePage);
