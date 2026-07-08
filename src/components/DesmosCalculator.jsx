import React, {useMemo, useState} from 'react';
import {Calculator, ExternalLink, X} from 'lucide-react';
import {useLocation} from 'react-router-dom';

const CALCULATORS = {
    graphing: 'https://www.desmos.com/calculator',
    scientific: 'https://www.desmos.com/scientific',
};

function shouldShowCalculator(pathname) {
    return (
        pathname === '/trainer' ||
        pathname === '/infinite_questions' ||
        pathname === '/questions' ||
        pathname === '/practice_test' ||
        pathname === '/full_length_test' ||
        pathname === '/power_sprint' ||
        pathname === '/sat_survival' ||
        pathname === '/timed_challenges' ||
        pathname.startsWith('/study_guides') ||
        (pathname.startsWith('/tournament/') && pathname.endsWith('/questions'))
    );
}

function DesmosCalculator() {
    const {pathname} = useLocation();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('graphing');
    const visible = useMemo(() => shouldShowCalculator(pathname), [pathname]);

    if (!visible) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-20 right-5 z-[60] flex size-12 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-slate-950 text-white shadow-lg transition hover:bg-slate-800 sm:bottom-6"
                aria-label="Open Desmos calculator"
                title="Open Desmos calculator"
            >
                <Calculator className="size-5"/>
            </button>

            {open && (
                <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/55 sm:items-center sm:p-6">
                    <section className="flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[82vh] sm:rounded-2xl">
                        <header className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="m-0 flex items-center gap-2 text-base font-bold text-slate-950">
                                    <Calculator className="size-4"/> Desmos
                                </h2>
                                <a
                                    href={CALCULATORS[mode]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex size-9 items-center justify-center rounded-lg text-slate-500 no-underline hover:bg-slate-100"
                                    aria-label="Open Desmos in a new tab"
                                    title="Open Desmos in a new tab"
                                >
                                    <ExternalLink className="size-4"/>
                                </a>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                                    {Object.keys(CALCULATORS).map((key) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setMode(key)}
                                            className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition-colors ${
                                                mode === key ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                                    aria-label="Close Desmos calculator"
                                    title="Close"
                                >
                                    <X className="size-5"/>
                                </button>
                            </div>
                        </header>
                        <iframe
                            key={mode}
                            src={CALCULATORS[mode]}
                            title={`Desmos ${mode} calculator`}
                            className="min-h-0 flex-1 border-0"
                            allow="clipboard-read; clipboard-write"
                        />
                    </section>
                </div>
            )}
        </>
    );
}

export default DesmosCalculator;
