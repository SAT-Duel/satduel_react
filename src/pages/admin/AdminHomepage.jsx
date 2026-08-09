import React from 'react';
import {useNavigate} from 'react-router-dom';
import {ClipboardCheck, ClipboardList, Database, FileText, Flag, Sparkles, Trophy} from 'lucide-react';
import {Card, PageContainer} from '../../components/ui';
import withAuth from '../../hoc/withAuth';

const toolGroups = [
    {
        title: 'Question Bank',
        description: 'Create and maintain the questions students practice with.',
        tone: 'primary',
        tools: [
            {title: 'Question List', description: 'Manage, preview, create, and edit the question bank.', icon: FileText, action: 'questions'},
            {title: 'AI Question Generator', description: 'Generate SAT questions by official skill, review, and import.', icon: Sparkles, action: 'generate'},
        ],
    },
    {
        title: 'Practice Tests',
        description: 'Generate private modules, then assemble them into adaptive tests.',
        tone: 'cyan',
        tools: [
            {title: 'AI Practice Test Generator', description: 'Build and store isolated adaptive SAT modules with a manual AI prompt.', icon: ClipboardList, action: 'generate-test'},
            {title: 'Practice Test Creator', description: 'Publish full-length or single-subject adaptive tests and monitor completions.', icon: ClipboardCheck, action: 'create-test'},
        ],
    },
    {
        title: 'Operations',
        description: 'Review issues and manage supporting content.',
        tone: 'slate',
        tools: [
            {title: 'Question Reports', description: 'Review reported questions and clear resolved reports.', icon: Flag, action: 'reports'},
            {title: 'Create Tournament', description: 'Build a curated tournament from selected questions.', icon: Trophy, action: 'tournament'},
            {title: 'Backend Database', description: 'Open Django admin for data operations not exposed here.', icon: Database, action: 'backend'},
        ],
    },
];

const tones = {
    primary: 'border-primary-200 bg-primary-50 text-primary-700',
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    slate: 'border-slate-200 bg-slate-100 text-slate-600',
};

function AdminHome() {
    const navigate = useNavigate();

    const handleToolClick = (action) => {
        if (action === 'backend') {
            window.location.href = 'https://satduel-e07814415d4e.herokuapp.com/admin/';
            return;
        }
        const paths = {
            questions: '/admin/questions',
            reports: '/admin/question_reports',
            generate: '/admin/generate_questions',
            'generate-test': '/admin/generate_practice_test',
            'create-test': '/admin/create_practice_test',
            tournament: '/admin/create_tournament',
        };
        navigate(paths[action]);
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

            <div className="space-y-9">
                {toolGroups.map((group) => (
                    <section key={group.title}>
                        <div className="mb-3">
                            <h2 className="m-0 font-display text-xl font-black text-slate-950">{group.title}</h2>
                            <p className="m-0 mt-1 text-sm text-slate-500">{group.description}</p>
                        </div>
                        <div className={`grid gap-4 ${group.tools.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                            {group.tools.map(({title, description, icon: Icon, action}) => (
                                <button
                                    key={title}
                                    type="button"
                                    onClick={() => handleToolClick(action)}
                                    className="text-left"
                                >
                                    <Card hover className="flex h-full items-start gap-4 p-5">
                                        <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border ${tones[group.tone]}`}>
                                            <Icon size={21}/>
                                        </div>
                                        <div>
                                            <h3 className="m-0 text-base font-black text-slate-950">{title}</h3>
                                            <p className="m-0 mt-1 text-sm leading-6 text-slate-500">{description}</p>
                                        </div>
                                    </Card>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </PageContainer>
    );
}

export default withAuth(AdminHome, true);
