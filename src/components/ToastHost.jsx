import React, {useEffect, useState} from 'react';
import {CheckCircle2, Info, TriangleAlert, X} from 'lucide-react';
import {subscribeToNotifications} from '../utils/notify';

const TOAST_STYLES = {
    success: {
        icon: CheckCircle2,
        className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    },
    error: {
        icon: TriangleAlert,
        className: 'border-rose-200 bg-rose-50 text-rose-800',
    },
    warning: {
        icon: TriangleAlert,
        className: 'border-amber-200 bg-amber-50 text-amber-800',
    },
    info: {
        icon: Info,
        className: 'border-primary-200 bg-primary-50 text-primary-800',
    },
};

function ToastHost() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => subscribeToNotifications((toast) => {
        setToasts((current) => [...current, toast].slice(-4));
        window.setTimeout(() => {
            setToasts((current) => current.filter((item) => item.id !== toast.id));
        }, 4200);
    }), []);

    if (!toasts.length) return null;

    return (
        <div className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
            {toasts.map((toast) => {
                const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
                const Icon = style.icon;
                return (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg ${style.className}`}
                    >
                        <Icon className="mt-0.5 size-4 shrink-0"/>
                        <p className="m-0 flex-1 leading-relaxed">{toast.text}</p>
                        <button
                            type="button"
                            onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-white/50"
                            aria-label="Dismiss notification"
                        >
                            <X className="size-3.5"/>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default ToastHost;
