import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Calculator, ExternalLink, X} from 'lucide-react';
import {useLocation} from 'react-router-dom';

const DESMOS_URL = 'https://www.desmos.com/calculator';
const PANEL_WIDTH = 380;
const PANEL_HEIGHT = 660;
const PANEL_MARGIN = 8;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function panelPosition(x, y) {
    if (typeof window === 'undefined') return {x, y};
    const width = Math.min(PANEL_WIDTH, window.innerWidth - PANEL_MARGIN * 2);
    const height = Math.min(PANEL_HEIGHT, window.innerHeight - PANEL_MARGIN * 2);
    return {
        x: clamp(x, PANEL_MARGIN, Math.max(PANEL_MARGIN, window.innerWidth - width - PANEL_MARGIN)),
        y: clamp(y, PANEL_MARGIN, Math.max(PANEL_MARGIN, window.innerHeight - height - PANEL_MARGIN)),
    };
}

function defaultPosition() {
    if (typeof window === 'undefined') return {x: 24, y: 80};
    return panelPosition(window.innerWidth - PANEL_WIDTH - 24, 80);
}

function shouldShowCalculator(pathname) {
    return (
        pathname === '/infinite_questions' ||
        pathname === '/questions' ||
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
    const [position, setPosition] = useState(defaultPosition);
    const [dragging, setDragging] = useState(false);
    const dragOffset = useRef({x: 0, y: 0});
    const visible = useMemo(() => shouldShowCalculator(pathname), [pathname]);

    const openCalculator = () => {
        setPosition((current) => panelPosition(current.x, current.y));
        setOpen(true);
    };

    const startDrag = useCallback((event) => {
        if (event.button !== 0) return;
        dragOffset.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        };
        setDragging(true);
        event.preventDefault();
    }, [position.x, position.y]);

    useEffect(() => {
        if (!dragging) return;
        const drag = (event) => {
            setPosition(panelPosition(
                event.clientX - dragOffset.current.x,
                event.clientY - dragOffset.current.y
            ));
        };
        const stopDrag = () => setDragging(false);
        window.addEventListener('pointermove', drag);
        window.addEventListener('pointerup', stopDrag);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDrag);
        return () => {
            window.removeEventListener('pointermove', drag);
            window.removeEventListener('pointerup', stopDrag);
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('mouseup', stopDrag);
        };
    }, [dragging]);

    if (!visible) return null;

    return (
        <>
            {!open && (
                <button
                    type="button"
                    onClick={openCalculator}
                    className="fixed bottom-20 right-5 z-[60] flex size-12 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-slate-950 text-white shadow-lg transition hover:bg-slate-800 sm:bottom-6"
                    aria-label="Open Desmos calculator"
                    title="Open Desmos calculator"
                >
                    <Calculator className="size-5"/>
                </button>
            )}

            {open && (
                <section
                    className="fixed z-[90] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    style={{
                        left: position.x,
                        top: position.y,
                        width: `min(${PANEL_WIDTH}px, calc(100vw - ${PANEL_MARGIN * 2}px))`,
                        height: `min(${PANEL_HEIGHT}px, calc(100vh - ${PANEL_MARGIN * 2}px))`,
                    }}
                >
                    <header
                        onPointerDown={startDrag}
                        onMouseDown={startDrag}
                        className="flex cursor-move touch-none items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2"
                    >
                        <h2 className="m-0 flex items-center gap-2 text-sm font-bold text-slate-950">
                            <Calculator className="size-4"/> Desmos
                        </h2>
                        <div className="flex items-center gap-1" onPointerDown={(event) => event.stopPropagation()}>
                            <a
                                href={DESMOS_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="flex size-8 items-center justify-center rounded-lg text-slate-500 no-underline hover:bg-slate-100"
                                aria-label="Open Desmos in a new tab"
                                title="Open Desmos in a new tab"
                            >
                                <ExternalLink className="size-4"/>
                            </a>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                aria-label="Close Desmos calculator"
                                title="Close"
                            >
                                <X className="size-4"/>
                            </button>
                        </div>
                    </header>
                    <iframe
                        src={DESMOS_URL}
                        title="Desmos graphing calculator"
                        className="min-h-0 flex-1 border-0"
                        allow="clipboard-read; clipboard-write"
                    />
                </section>
            )}
        </>
    );
}

export default DesmosCalculator;
