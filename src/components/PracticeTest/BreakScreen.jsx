import React, {useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext';

const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function BreakScreen({initialSeconds, onResume, working}) {
    const {user} = useAuth();
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        const deadline = Date.now() + initialSeconds * 1000;
        const tick = () => setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
        const timer = window.setInterval(tick, 250);
        return () => window.clearInterval(timer);
    }, [initialSeconds]);

    return (
        <main className="bluebook-break-screen min-h-screen px-6 py-10 sm:px-10">
            <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                <section className="text-center">
                    <div className="mx-auto max-w-sm rounded-xl border-2 border-current px-8 py-6">
                        <p className="m-0 text-xl font-bold">Remaining Break Time:</p>
                        <p className="m-0 mt-2 text-7xl font-black tabular-nums sm:text-8xl">{formatTime(seconds)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onResume}
                        disabled={working}
                        className="mt-7 cursor-pointer rounded-full bg-yellow-300 px-8 py-3 text-base font-black text-slate-950 shadow-sm hover:bg-yellow-200 disabled:cursor-wait disabled:opacity-60"
                    >
                        {working ? 'Opening Math…' : 'Resume Testing'}
                    </button>
                </section>

                <section className="max-w-xl">
                    <h1 className="m-0 text-4xl font-black sm:text-5xl">Practice Test Break</h1>
                    <p className="m-0 mt-7 max-w-lg text-lg leading-8 opacity-80">
                        Reading and Writing is complete. Take a short break, then continue when you are ready.
                    </p>
                    <hr className="my-10 border-current opacity-50"/>
                    <h2 className="m-0 text-3xl font-black sm:text-4xl">Take a Break. Keep This Page Open.</h2>
                    <p className="m-0 mt-7 text-lg leading-8 opacity-80">
                        When you resume, you’ll begin the Math section. You cannot return to the completed Reading and Writing modules.
                    </p>
                </section>
            </div>
            <p className="fixed bottom-7 left-7 m-0 text-xl font-bold sm:left-10">{user?.username || 'Student'}</p>
        </main>
    );
}
