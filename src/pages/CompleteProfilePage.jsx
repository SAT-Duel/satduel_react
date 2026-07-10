import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useNavigate} from 'react-router-dom';
import api from '../components/api';
import {Button, Card, Select, Alert} from '../components/ui';
import useSdTheme from '../hooks/useSdTheme';
import '../styles/landing.css';

const GRADES = ['<1', ...Array.from({length: 12}, (_, i) => String(i + 1)), '>12'];

/**
 * Shown after a new Google signup: collects the one field Google can't give us
 * (grade), then continues into the normal first-login goal-setting flow.
 */
const CompleteProfilePage = () => {
    const [theme] = useSdTheme();
    const [grade, setGrade] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!grade) {
            setError('Please select your grade.');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await api.post('api/auth/complete_profile/', {grade});
            navigate('/welcome');
        } catch (e) {
            setError(e.response?.data?.error || 'Could not save your grade. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="sd-landing flex min-h-screen items-center justify-center px-4" data-theme={theme}>
            <Helmet>
                <title>Complete profile | SAT Duel</title>
            </Helmet>
            <Card className="w-full max-w-md p-8 text-center">
                <h1 className="mb-1 font-display text-2xl font-bold text-slate-900">
                    Welcome to SAT Duel!
                </h1>
                <p className="mb-6 text-[15px] text-slate-500">
                    One quick thing — what grade are you in?
                </p>
                <Select value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <option value="" disabled>Select your grade</option>
                    {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </Select>
                {error && <div className="mt-4"><Alert>{error}</Alert></div>}
                <div className="mt-6">
                    <Button block loading={submitting} onClick={handleSubmit}>
                        Continue
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default CompleteProfilePage;
