import React from 'react';
import {Clock3} from 'lucide-react';
import {Button} from '../ui';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function TestHeader({timeLeft, hideTimer, onToggleHide}) {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
                <div>
                    <p className="m-0 text-xs font-black uppercase text-slate-400">Section 1</p>
                    <p className="m-0 font-display text-lg font-black text-slate-950">Reading and Writing</p>
                </div>

                <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center">
                    {!hideTimer && (
                        <p className="m-0 flex items-center gap-2 font-display text-xl font-black text-slate-950">
                            <Clock3 className="size-5 text-primary-600"/> {formatTime(timeLeft)}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={onToggleHide}
                        className="mt-1 cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-black text-slate-500 hover:bg-white"
                    >
                        {hideTimer ? 'Show timer' : 'Hide timer'}
                    </button>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                    <Button variant="ghost" size="sm">Notes</Button>
                    <Button variant="ghost" size="sm">More</Button>
                </div>
            </div>
        </header>
    );
}

export default TestHeader;
