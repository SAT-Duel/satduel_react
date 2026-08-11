import React, {useEffect} from 'react';
import {Calculator, Highlighter, LogOut} from 'lucide-react';
import {useDesmos} from '../DesmosCalculator';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function TestHeader({
    timeLeft = null,
    hideTimer = false,
    onToggleHide,
    sectionNumber = 1,
    moduleNumber = 1,
    title = 'Reading and Writing',
    statusLabel,
    onQuit = null,
    showDesmos = false,
    highlighterActive = false,
    onToggleHighlighter = null,
}) {
    const {open: openDesmos, close: closeDesmos} = useDesmos();

    useEffect(() => {
        if (!showDesmos) closeDesmos();
    }, [closeDesmos, showDesmos]);

    return (
        <header className="sticky top-0 z-40 border-b-2 border-slate-900 bg-[#e8f0fb] px-4 py-3 text-slate-950 sm:px-7">
            <div className="relative mx-auto grid max-w-[1500px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:min-h-16 sm:grid-cols-[1fr_auto_1fr]">
                <div className="min-w-0">
                    <h1 className="m-0 truncate text-base font-black sm:text-xl">
                        Section {sectionNumber}, Module {moduleNumber}: {title}
                    </h1>
                    {statusLabel && <p className="m-0 mt-1 hidden text-xs font-bold text-slate-500 sm:block">{statusLabel}</p>}
                </div>

                {timeLeft != null && (
                    <div className="col-span-2 row-start-2 flex items-center justify-center gap-2 sm:col-span-1 sm:row-auto sm:flex-col sm:gap-1">
                        {!hideTimer && <p className="m-0 text-2xl font-black tabular-nums">{formatTime(timeLeft)}</p>}
                        <button
                            type="button"
                            onClick={onToggleHide}
                            className="cursor-pointer rounded-full border border-slate-900 bg-transparent px-4 py-0.5 text-xs font-black hover:bg-white/60"
                        >
                            {hideTimer ? 'Show' : 'Hide'}
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-end gap-1 sm:gap-4">
                    {showDesmos && (
                        <button type="button" onClick={openDesmos} className="flex cursor-pointer flex-col items-center rounded-lg px-2 py-1 text-[11px] font-black hover:bg-white/60">
                            <Calculator className="size-5"/><span className="hidden sm:inline">Desmos</span>
                        </button>
                    )}
                    {onToggleHighlighter && (
                        <button
                            type="button"
                            onClick={onToggleHighlighter}
                            aria-pressed={highlighterActive}
                            className={`flex cursor-pointer flex-col items-center rounded-lg px-2 py-1 text-[11px] font-black ${highlighterActive ? 'bg-primary-700 text-white' : 'hover:bg-white/60'}`}
                        >
                            <Highlighter className="size-5"/><span className="hidden sm:inline">Highlights</span>
                        </button>
                    )}
                    {onQuit && (
                        <button type="button" onClick={onQuit} className="flex cursor-pointer flex-col items-center rounded-lg px-2 py-1 text-[11px] font-black hover:bg-white/60" aria-label="Save and quit practice test">
                            <LogOut className="size-5"/><span className="hidden sm:inline">Quit</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
