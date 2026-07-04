/**
 * SAT Duel UI kit — small set of Tailwind-styled primitives shared by the
 * redesigned pages. Chunky rounded interactive elements with a pressed-down
 * effect, white cards on a near-white page, violet accent.
 */
import React from 'react';
import {Link} from 'react-router-dom';

const BUTTON_VARIANTS = {
    primary:
        'bg-primary-600 text-white border-primary-800 hover:bg-primary-500 ' +
        'shadow-[0_4px_0_0_var(--color-primary-800)]',
    secondary:
        'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 ' +
        'shadow-[0_4px_0_0_var(--color-slate-300)]',
    ghost:
        'bg-transparent text-slate-600 border-transparent shadow-none hover:bg-slate-100',
    danger:
        'bg-rose-500 text-white border-rose-700 hover:bg-rose-400 ' +
        'shadow-[0_4px_0_0_var(--color-rose-700)]',
};

const BUTTON_SIZES = {
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-[15px]',
    lg: 'px-7 py-3.5 text-base',
};

export function Button({
    variant = 'primary',
    size = 'md',
    to,
    href,
    block = false,
    loading = false,
    className = '',
    children,
    disabled,
    ...rest
}) {
    const classes = [
        'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl border-2',
        'transition-all duration-100 cursor-pointer select-none no-underline',
        'active:translate-y-[3px] active:shadow-none',
        'disabled:opacity-50 disabled:pointer-events-none',
        BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary,
        BUTTON_SIZES[size] || BUTTON_SIZES.md,
        block ? 'w-full' : '',
        className,
    ].join(' ');

    const content = (
        <>
            {loading && <Spinner className="size-4 border-2"/>}
            {children}
        </>
    );

    if (to) {
        return <Link to={to} className={classes} {...rest}>{content}</Link>;
    }
    if (href) {
        return <a href={href} className={classes} {...rest}>{content}</a>;
    }
    return (
        <button className={classes} disabled={disabled || loading} {...rest}>
            {content}
        </button>
    );
}

export function Card({className = '', hover = false, children, ...rest}) {
    return (
        <div
            className={[
                'bg-white border border-slate-200 rounded-2xl',
                hover ? 'transition-all hover:border-primary-300 hover:shadow-md' : '',
                className,
            ].join(' ')}
            {...rest}
        >
            {children}
        </div>
    );
}

export function Field({label, error, children}) {
    return (
        <label className="block text-left">
            {label && (
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
            )}
            {children}
            {error && <span className="mt-1 block text-sm text-rose-600">{error}</span>}
        </label>
    );
}

export const Input = React.forwardRef(function Input({className = '', ...rest}, ref) {
    return (
        <input
            ref={ref}
            className={[
                'w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-[15px]',
                'text-slate-800 placeholder:text-slate-400 outline-none transition-colors',
                'focus:border-primary-500',
                className,
            ].join(' ')}
            {...rest}
        />
    );
});

export function Select({className = '', children, ...rest}) {
    return (
        <select
            className={[
                'w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5',
                'text-[15px] text-slate-800 outline-none transition-colors focus:border-primary-500',
                className,
            ].join(' ')}
            {...rest}
        >
            {children}
        </select>
    );
}

export function Spinner({className = ''}) {
    return (
        <span
            className={[
                'inline-block size-5 animate-spin rounded-full border-[3px]',
                'border-slate-300 border-t-primary-600',
                className,
            ].join(' ')}
        />
    );
}

export function PageContainer({className = '', children}) {
    return (
        <div className={['mx-auto w-full max-w-6xl px-4 sm:px-6', className].join(' ')}>
            {children}
        </div>
    );
}

export function DividerLabel({children}) {
    return (
        <div className="my-5 flex items-center gap-3 text-sm text-slate-400">
            <span className="h-px flex-1 bg-slate-200"/>
            {children}
            <span className="h-px flex-1 bg-slate-200"/>
        </div>
    );
}

export function Alert({type = 'error', children}) {
    const styles = type === 'error'
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return (
        <div className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${styles}`}>
            {children}
        </div>
    );
}
