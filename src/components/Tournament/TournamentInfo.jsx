import React from 'react';
import {Clock3, Trophy, Users} from 'lucide-react';

function InfoRow({icon: Icon, label, value}) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <Icon className="size-4 text-primary-600"/>
            <div>
                <p className="m-0 text-xs font-black uppercase text-slate-400">{label}</p>
                <p className="m-0 text-sm font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
}

function TournamentInfo({participantInfo, timeLeft}) {
    return (
        <div className="sat-arena-card rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="m-0 font-display text-xl font-black text-slate-950">Tournament info</h3>
            {participantInfo && (
                <div className="mt-4 space-y-2">
                    <InfoRow icon={Trophy} label="Tournament" value={participantInfo.tournament.name}/>
                    <InfoRow icon={Users} label="Questions" value={participantInfo.tournament.questionNumber}/>
                    <InfoRow icon={Users} label="Participants" value={participantInfo.tournament.participantNumber}/>
                </div>
            )}
            <div className="mt-4 rounded-2xl bg-slate-950 px-5 py-6 text-center text-white">
                <p className="m-0 flex items-center justify-center gap-2 text-sm font-black uppercase text-cyan-200">
                    <Clock3 className="size-4"/> Time left
                </p>
                <p className="m-0 mt-2 font-display text-4xl font-black">{timeLeft}</p>
            </div>
        </div>
    );
}

export default TournamentInfo;
