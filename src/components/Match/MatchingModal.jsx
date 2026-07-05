import React, {useEffect, useState} from 'react';
import {Search, X} from 'lucide-react';
import {Button, Spinner} from '../ui';

const MESSAGES = [
    'Searching for a live opponent…',
    'Preparing the same question set…',
    'Checking active students…',
    'Almost ready…',
];

function MatchingModal({visible, onCancel}) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!visible) return undefined;
        const interval = setInterval(() => {
            setMessageIndex((index) => (index + 1) % MESSAGES.length);
        }, 2600);
        return () => clearInterval(interval);
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                            <Search className="size-5"/>
                        </div>
                        <div>
                            <h2 className="m-0 text-xl font-bold text-slate-900">Finding a duel</h2>
                            <p className="m-0 mt-1 text-sm text-slate-500">This usually takes under a minute.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                        aria-label="Cancel matching"
                    >
                        <X className="size-5"/>
                    </button>
                </div>

                <div className="mt-8 flex flex-col items-center rounded-2xl bg-slate-50 px-5 py-8 text-center">
                    <Spinner className="size-10"/>
                    <p className="m-0 mt-4 font-semibold text-slate-700">{MESSAGES[messageIndex]}</p>
                    <p className="m-0 mt-2 text-sm text-slate-500">
                        Keep this window open while we match you.
                    </p>
                </div>

                <Button onClick={onCancel} variant="secondary" block className="mt-5">
                    Cancel search
                </Button>
            </div>
        </div>
    );
}

export default MatchingModal;
