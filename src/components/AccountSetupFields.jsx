import React, {useEffect, useState} from 'react';
import {CalendarDays} from 'lucide-react';
import {Link} from 'react-router-dom';
import api from './api';

export const UNKNOWN_SAT_DATE = 'unknown';

export function useOnboardingPreferences(user) {
    const [marketingOptIn, setMarketingOptIn] = useState(Boolean(user?.marketing_opt_in));
    const [termsAccepted, setTermsAccepted] = useState(Boolean(user?.terms_accepted));
    const [preferencesReady, setPreferencesReady] = useState(typeof user?.marketing_opt_in === 'boolean');
    const [preferencesError, setPreferencesError] = useState('');

    useEffect(() => {
        if (!user) return undefined;
        if (typeof user.marketing_opt_in === 'boolean') {
            setMarketingOptIn(user.marketing_opt_in);
            setTermsAccepted(Boolean(user.terms_accepted));
            setPreferencesReady(true);
            return undefined;
        }

        let active = true;
        api.get('api/profile/')
            .then(({data}) => {
                if (!active) return;
                setMarketingOptIn(Boolean(data.onboarding?.marketing_opt_in));
                setTermsAccepted(Boolean(data.onboarding?.terms_accepted));
                setPreferencesReady(true);
            })
            .catch(() => {
                if (!active) return;
                setPreferencesError('Could not load your current account choices. Reload the page to try again.');
            });

        return () => { active = false; };
    }, [user]);

    return {
        marketingOptIn,
        setMarketingOptIn,
        termsAccepted,
        setTermsAccepted,
        preferencesReady,
        preferencesError,
    };
}

export function useSatExamDates() {
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('api/auth/sat_exam_dates/')
            .then(({data}) => setDates(data.dates || []))
            .catch(() => setError('Could not load the latest SAT dates. You can still choose “I don’t know yet”.'))
            .finally(() => setLoading(false));
    }, []);

    return {dates, loading, error};
}

export function SetupProgress({step, labels = ['About you', 'SAT date', 'Updates']}) {
    return (
        <div className="mb-7" aria-label={`Step ${step} of ${labels.length}`}>
            <div className="mb-2 flex gap-2" aria-hidden="true">
                {labels.map((label, index) => (
                    <span
                        key={label}
                        className={`h-2 flex-1 rounded-full ${index < step ? 'bg-primary-600' : 'bg-slate-200'}`}
                    />
                ))}
            </div>
            <p className="m-0 text-xs font-bold uppercase tracking-wide text-slate-400">
                Step {step} of {labels.length} · {labels[step - 1]}
            </p>
        </div>
    );
}

function formatDate(value) {
    return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function SatDatePicker({dates, value, onChange, loading = false}) {
    return (
        <fieldset>
            <legend className="sr-only">Next SAT date</legend>
            <div className="grid gap-3 sm:grid-cols-2">
                {loading && <p className="col-span-full m-0 py-8 text-center text-sm text-slate-500">Loading SAT dates…</p>}
                {dates.map((date) => (
                    <label
                        key={date}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                            value === date
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-slate-200 bg-white hover:border-primary-300'
                        }`}
                    >
                        <input
                            type="radio"
                            name="sat-exam-date"
                            value={date}
                            checked={value === date}
                            onChange={() => onChange(date)}
                            className="size-4 accent-primary-600"
                        />
                        <span className="text-sm font-bold text-slate-800">{formatDate(date)}</span>
                    </label>
                ))}
                <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors sm:col-span-2 ${
                        value === UNKNOWN_SAT_DATE
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 bg-white hover:border-primary-300'
                    }`}
                >
                    <input
                        type="radio"
                        name="sat-exam-date"
                        value={UNKNOWN_SAT_DATE}
                        checked={value === UNKNOWN_SAT_DATE}
                        onChange={() => onChange(UNKNOWN_SAT_DATE)}
                        className="size-4 accent-primary-600"
                    />
                    <span>
                        <span className="block text-sm font-bold text-slate-800">I don’t know yet</span>
                        <span className="block text-xs text-slate-500">That’s okay—your dashboard works without a countdown.</span>
                    </span>
                </label>
            </div>
            <p className="m-0 mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="size-3.5"/>
                Weekend dates from{' '}
                <a
                    href="https://satsuite.collegeboard.org/sat/dates-deadlines"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary-600 hover:text-primary-700"
                >
                    College Board
                </a>
            </p>
        </fieldset>
    );
}

export function TermsAgreement({checked, onChange}) {
    return (
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-left">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-primary-600"
            />
            <span className="text-sm leading-5 text-slate-600">
                I’ve read and agree to SAT Duel’s{' '}
                <Link to="/terms" target="_blank" className="font-semibold text-primary-600 hover:text-primary-700">Terms of Service</Link>
                {' '}and acknowledge the{' '}
                <Link to="/privacy" target="_blank" className="font-semibold text-primary-600 hover:text-primary-700">Privacy Policy</Link>.
            </span>
        </label>
    );
}

export function MarketingChoice({checked, onChange}) {
    return (
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-left">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-primary-600"
            />
            <span className="text-sm leading-5 text-slate-600">
                Email me SAT Duel practice reminders, tournament news, and offers.
            </span>
        </label>
    );
}
