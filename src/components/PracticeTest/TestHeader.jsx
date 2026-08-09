import React, {useEffect} from 'react';
import {Calculator, Clock3, LogOut} from 'lucide-react';
import {useDesmos} from '../DesmosCalculator';
import {Button} from '../ui';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function TestHeader({
    timeLeft = null,
    hideTimer = false,
    onToggleHide,
    eyebrow = 'Section 1',
    title = 'Reading and Writing',
    statusLabel,
    onQuit = null,
    showDesmos = false,
}) {
    const {open: openDesmos, close: closeDesmos} = useDesmos();

    useEffect(() => {
        if (!showDesmos) closeDesmos();
    }, [closeDesmos, showDesmos]);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 sm:flex sm:justify-between">
                <div className="min-w-0">
                    <p className={`m-0 text-xs font-black uppercase ${statusLabel ? 'text-primary-500' : 'text-slate-400'}`}>{eyebrow}</p>
                    <p className="m-0 truncate font-display text-lg font-black text-slate-950">{title}</p>
                </div>

                {timeLeft != null && (
                    <div className="col-span-2 row-start-2 flex items-center justify-center gap-2 sm:absolute sm:left-1/2 sm:row-auto sm:-translate-x-1/2 sm:flex-col sm:gap-0">
                        {!hideTimer && (
                            <p className="m-0 flex items-center gap-2 font-display text-xl font-black text-slate-950">
                                <Clock3 className="size-5 text-primary-600"/> {formatTime(timeLeft)}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={onToggleHide}
                            className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-black text-slate-500 hover:bg-white sm:mt-1"
                        >
                            {hideTimer ? 'Show timer' : 'Hide timer'}
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {showDesmos && (
                        <Button variant="secondary" size="sm" onClick={openDesmos}>
                            <Calculator className="size-4"/> DESMOS
                        </Button>
                    )}
                    {onQuit && (
                        <Button variant="ghost" size="sm" onClick={onQuit} aria-label="Quit practice test">
                            <LogOut className="size-4"/> <span className="hidden sm:inline">Quit</span>
                        </Button>
                    )}
                    {statusLabel ? (
                        <span className="hidden rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-black text-primary-700 sm:inline-flex">
                            {statusLabel}
                        </span>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm">Notes</Button>
                            <Button variant="ghost" size="sm">More</Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default TestHeader;
