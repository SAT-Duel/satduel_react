import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Database, FileText, Trophy} from 'lucide-react';
import {Card, PageContainer} from '../../components/ui';
import withAuth from '../../hoc/withAuth';

const tools = [
    {
        title: 'Question List',
        description: 'Manage, preview, create, and edit the question bank.',
        icon: FileText,
        action: 'questions',
    },
    {
        title: 'Backend Database',
        description: 'Open the Django admin for data operations that are not exposed here.',
        icon: Database,
        action: 'backend',
    },
    {
        title: 'Create Tournament',
        description: 'Build a curated tournament from selected questions.',
        icon: Trophy,
        action: 'tournament',
    },
];

function AdminHome() {
    const navigate = useNavigate();

    const handleToolClick = (action) => {
        if (action === 'backend') {
            window.location.href = 'https://satduel-e07814415d4e.herokuapp.com/admin/';
            return;
        }
        navigate(action === 'questions' ? '/admin/questions' : '/admin/create_tournament');
    };

    return (
        <PageContainer className="min-h-screen py-8 sm:py-10">
            <div className="mb-8">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                    Staff Console
                </div>
                <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">Admin Tools</h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                    Lightweight operations for keeping SAT Duel content and tournaments moving.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {tools.map(({title, description, icon: Icon, action}) => (
                    <button
                        key={title}
                        type="button"
                        onClick={() => handleToolClick(action)}
                        className="text-left"
                    >
                        <Card hover className="h-full p-6">
                            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border-2 border-primary-200 bg-primary-50 text-primary-700">
                                <Icon size={26}/>
                            </div>
                            <h2 className="text-xl font-black text-slate-950">{title}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                        </Card>
                    </button>
                ))}
            </div>
        </PageContainer>
    );
}

export default withAuth(AdminHome, true);
