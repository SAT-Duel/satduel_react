import React from 'react';
import {ArrowRight, Hash, Users} from 'lucide-react';
import {Card, Button} from '../ui';

const ClassCard = ({cls}) => {
    const initial = cls.name?.[0]?.toUpperCase() || 'C';

    return (
        <Card hover className="flex h-full flex-col p-5">
            <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-cyan-200 bg-cyan-50 text-lg font-black text-cyan-700">
                    {initial}
                </div>
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-black text-slate-950">{cls.name}</h3>
                    <p className="mt-1 line-clamp-3 min-h-12 text-sm leading-6 text-slate-500">
                        {cls.description || 'No description yet.'}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                    <Hash size={13}/>
                    {cls.code}
                </span>
                {Number.isFinite(cls.student_count) && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                        <Users size={13}/>
                        {cls.student_count}
                    </span>
                )}
            </div>

            <Button to={`/classes/${cls.id}`} className="mt-5" size="sm" block>
                Enter Class <ArrowRight size={16}/>
            </Button>
        </Card>
    );
};

export default ClassCard;
