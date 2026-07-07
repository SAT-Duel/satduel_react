import React from 'react';
import {Clock3, Trophy, Users} from 'lucide-react';

function InfoRow({icon: Icon, label, value}) {
    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-2 text-slate-500">
                <Icon className="size-4 shrink-0"/>
                <span>{label}</span>
            </div>
            <span className="min-w-0 truncate font-semibold text-slate-800">{value}</span>
        </div>
    );
}

function TournamentInfo({participantInfo, timeLeft}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="m-0 flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Clock3 className="size-4"/> Time left
                </p>
                <p className="m-0 font-mono text-2xl font-black text-slate-950">{timeLeft}</p>
            </div>
            {participantInfo && (
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    <InfoRow icon={Trophy} label="Tournament" value={participantInfo.tournament.name}/>
                    <InfoRow icon={Users} label="Questions" value={participantInfo.tournament.questionNumber}/>
                    <InfoRow icon={Users} label="Participants" value={participantInfo.tournament.participantNumber}/>
                </div>
            )}
        </div>
    );
}

export default TournamentInfo;
