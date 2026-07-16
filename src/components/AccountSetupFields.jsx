import React, {useEffect, useState} from 'react';
import {CalendarDays, Mail, ShieldCheck} from 'lucide-react';
import {Link} from 'react-router-dom';
import api from './api';
import {Toggle} from './ui';

export const UNKNOWN_SAT_DATE = 'unknown';

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
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-primary-600"
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
        <div className="space-y-4 text-left">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <Mail className="size-6"/>
            </div>
            <div>
                <h2 className="m-0 font-display text-2xl font-bold text-slate-900">Stay in the SAT Duel loop</h2>
                <p className="m-0 mt-2 text-[15px] leading-6 text-slate-500">
                    Get occasional practice reminders, tournament news, product updates, and SAT Duel discount codes.
                </p>
            </div>
            <Toggle
                checked={checked}
                onChange={onChange}
                label="Send me SAT Duel updates and offers"
                description="Recommended. You can unsubscribe from any email."
            />
            <p className="m-0 flex items-start gap-2 text-xs leading-5 text-slate-400">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0"/>
                We’ll use this choice only for SAT Duel communications and won’t sell your information.
            </p>
        </div>
    );
}
