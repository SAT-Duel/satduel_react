import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {BarChart3, Bookmark, Check, ChevronDown, CircleDot, FolderOpen, Lock, RotateCcw, Target} from 'lucide-react';

// The filter bar for the practice page. It narrows which question the "next"
// engine serves — by topic, difficulty level, saved state, whether the user
// has done it before, and how they last did on it. The whole bar is a premium
// feature, mirroring how topic selection was gated before.

export const EMPTY_FILTERS = {
    types: [],          // question types (multi-select); [] = all topics
    levels: [],         // difficulty 1-5 (multi-select); [] = all levels
    saved: 'all',       // all | only | exclude
    attempted: 'all',   // all | only | exclude   (done before)
    result: 'all',      // all | correct | incorrect
};

export function filtersActiveCount(filters) {
    let count = 0;
    if (filters.types.length) count += 1;
    if (filters.levels.length) count += 1;
    if (filters.saved !== 'all') count += 1;
    if (filters.attempted !== 'all') count += 1;
    if (filters.result !== 'all') count += 1;
    return count;
}

export function filtersToParams(filters, subject) {
    const params = {subject};
    if (filters.types.length) params.types = filters.types.join(',');
    if (filters.levels.length) params.levels = filters.levels.join(',');
    if (filters.saved !== 'all') params.saved = filters.saved;
    if (filters.attempted !== 'all') params.attempted = filters.attempted;
    if (filters.result !== 'all') params.result = filters.result;
    return params;
}

const LEVEL_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({value: n, label: `Level ${n}`}));
const SAVED_OPTIONS = [
    {value: 'all', label: 'All questions'},
    {value: 'only', label: 'Saved only'},
    {value: 'exclude', label: 'Not saved'},
];
const ATTEMPTED_OPTIONS = [
    {value: 'all', label: 'All questions'},
    {value: 'exclude', label: 'New only'},
    {value: 'only', label: 'Done before'},
];
const RESULT_OPTIONS = [
    {value: 'all', label: 'Show all'},
    {value: 'correct', label: 'Correct only'},
    {value: 'incorrect', label: 'Incorrect only'},
];

// A single dropdown chip. `multi` chips carry an array value; single chips a
// scalar. The panel closes on outside-click or Escape.
function FilterChip({icon: Icon, label, summary, active, disabled, children}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onDown = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const inner = (
        <>
            <Icon className="size-4 shrink-0"/>
            <span className="whitespace-nowrap">{label}</span>
            {active && summary && (
                <span className="max-w-[10rem] truncate rounded-md bg-primary-100 px-1.5 py-0.5 text-xs font-bold text-primary-700">
                    {summary}
                </span>
            )}
            <ChevronDown className={`size-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}/>
        </>
    );
    const chipClass = 'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors';

    // Locked chips are an upsell: clicking one sends free users to the upgrade
    // page rather than opening a panel they can't use.
    if (disabled) {
        return (
            <Link to="/upgrade" className={`${chipClass} border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100`}>
                {inner}
            </Link>
        );
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                className={[
                    chipClass,
                    active
                        ? 'border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                ].join(' ')}
            >
                {inner}
            </button>
            {open && (
                <div className="absolute left-0 top-full z-20 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    {children}
                </div>
            )}
        </div>
    );
}

function OptionRow({checked, roundedFull, onClick, children}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
            <span
                className={[
                    'flex size-4 shrink-0 items-center justify-center border transition-colors',
                    roundedFull ? 'rounded-full' : 'rounded',
                    checked ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 bg-white',
                ].join(' ')}
            >
                {checked && <Check className="size-3"/>}
            </span>
            <span className="min-w-0 flex-1 truncate">{children}</span>
        </button>
    );
}

function MultiPanel({options, value, onChange, emptyLabel}) {
    const toggle = (optionValue) => {
        onChange(value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue]);
    };
    return (
        <div className="max-h-72 overflow-y-auto">
            {value.length > 0 && (
                <button
                    type="button"
                    onClick={() => onChange([])}
                    className="mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                >
                    <RotateCcw className="size-3.5"/> Clear ({value.length})
                </button>
            )}
            {options.length === 0 && (
                <p className="px-2.5 py-2 text-sm text-slate-400">{emptyLabel}</p>
            )}
            {options.map((option) => (
                <OptionRow
                    key={option.value}
                    checked={value.includes(option.value)}
                    onClick={() => toggle(option.value)}
                >
                    {option.label}
                </OptionRow>
            ))}
        </div>
    );
}

function SinglePanel({options, value, onChange}) {
    return (
        <div>
            {options.map((option) => (
                <OptionRow
                    key={option.value}
                    roundedFull
                    checked={value === option.value}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </OptionRow>
            ))}
        </div>
    );
}

export default function PracticeFilterBar({filters, onChange, topics, isPremium}) {
    const set = (patch) => onChange({...filters, ...patch});
    const locked = !isPremium;

    const topicOptions = (topics || []).map((t) => ({value: t, label: t}));
    const topicSummary = filters.types.length
        ? (filters.types.length === 1 ? filters.types[0] : `${filters.types.length} topics`)
        : '';
    const levelSummary = filters.levels.length
        ? filters.levels.slice().sort().join(', ')
        : '';
    const singleSummary = (options, value) =>
        value === 'all' ? '' : options.find((o) => o.value === value)?.label;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <FilterChip
                icon={FolderOpen}
                label="Topic"
                summary={topicSummary}
                active={filters.types.length > 0}
                disabled={locked}
            >
                <MultiPanel
                    options={topicOptions}
                    value={filters.types}
                    onChange={(types) => set({types})}
                    emptyLabel="No topics available."
                />
            </FilterChip>

            <FilterChip
                icon={BarChart3}
                label="Level"
                summary={levelSummary}
                active={filters.levels.length > 0}
                disabled={locked}
            >
                <MultiPanel
                    options={LEVEL_OPTIONS}
                    value={filters.levels}
                    onChange={(levels) => set({levels})}
                    emptyLabel=""
                />
            </FilterChip>

            <FilterChip
                icon={Bookmark}
                label="Saved"
                summary={singleSummary(SAVED_OPTIONS, filters.saved)}
                active={filters.saved !== 'all'}
                disabled={locked}
            >
                <SinglePanel options={SAVED_OPTIONS} value={filters.saved} onChange={(saved) => set({saved})}/>
            </FilterChip>

            <FilterChip
                icon={CircleDot}
                label="Completed"
                summary={singleSummary(ATTEMPTED_OPTIONS, filters.attempted)}
                active={filters.attempted !== 'all'}
                disabled={locked}
            >
                <SinglePanel options={ATTEMPTED_OPTIONS} value={filters.attempted} onChange={(attempted) => set({attempted})}/>
            </FilterChip>

            <FilterChip
                icon={Target}
                label="Result"
                summary={singleSummary(RESULT_OPTIONS, filters.result)}
                active={filters.result !== 'all'}
                disabled={locked}
            >
                <SinglePanel options={RESULT_OPTIONS} value={filters.result} onChange={(result) => set({result})}/>
            </FilterChip>

            {locked ? (
                <Link
                    to="/upgrade"
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100"
                >
                    <Lock className="size-3.5"/> Premium
                </Link>
            ) : filtersActiveCount(filters) > 0 && (
                <button
                    type="button"
                    onClick={() => onChange(EMPTY_FILTERS)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                    <RotateCcw className="size-4"/> Reset
                </button>
            )}
        </div>
    );
}
