import React, {useState} from 'react';
import {ArrowRight, BookOpen, Clock3, Lock} from 'lucide-react';
import {Link} from 'react-router-dom';
import SEO from '../components/SEO';
import {Button, Card, PageContainer} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import {STUDY_GUIDE_MODULES} from '../content/studyGuideModules';

function ModuleButton({module, active, locked, onClick}) {
    const Icon = module.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'w-full cursor-pointer rounded-xl border px-3 py-3 text-left transition-colors',
                active
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50',
            ].join(' ')}
        >
            <div className="flex items-start gap-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${module.accent}`}>
                    <Icon className="size-4"/>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-950">{module.title}</span>
                        {locked && <Lock className="size-3.5 shrink-0 text-slate-400"/>}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                        {module.pages.length} lessons
                    </span>
                </span>
            </div>
        </button>
    );
}

function LessonRow({page, index}) {
    const content = (
        <>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">
                {index + 1}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block font-black text-slate-950">{page.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-500">{page.focus}</span>
            </span>
            {page.slug && <ArrowRight className="size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-500"/>}
        </>
    );

    if (!page.slug) {
        return <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">{content}</div>;
    }

    return (
        <Link
            to={`/study_guides/${page.slug}`}
            className="group flex gap-3 rounded-xl border border-primary-200 bg-primary-50/50 p-4 no-underline transition-colors hover:border-primary-300 hover:bg-primary-50"
        >
            {content}
        </Link>
    );
}

function ModuleSection({module, index, locked}) {
    const Icon = module.icon;

    return (
        <Card id={`module-${module.id}`} className="scroll-mt-6 overflow-hidden">
            <div className="border-b border-slate-100 bg-white px-5 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${module.accent}`}>
                            <Icon className="size-5"/>
                        </span>
                        <div>
                            <p className="m-0 text-xs font-black uppercase text-slate-400">Module {index + 1} · {module.domain}</p>
                            <h2 className="m-0 mt-1 font-display text-2xl font-black text-slate-950">{module.title}</h2>
                            <p className="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{module.summary}</p>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black uppercase text-slate-500">
                        <Clock3 className="size-3.5"/>
                        {module.time}
                    </span>
                </div>
            </div>

            {locked ? (
                <div className="bg-slate-50 px-5 py-6">
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                    <Lock className="size-5"/>
                                </span>
                                <div>
                                    <p className="m-0 font-black text-slate-950">Premium lessons</p>
                                    <p className="m-0 mt-1 text-sm leading-relaxed text-slate-600">
                                        Upgrade to unlock this module and its guided examples.
                                    </p>
                                </div>
                            </div>
                            <Button to="/upgrade" size="sm" variant="secondary">
                                Upgrade
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-5">
                    <div className="grid gap-3 md:grid-cols-2">
                        {module.pages.map((page, pageIndex) => (
                            <LessonRow key={page.title} page={page} index={pageIndex}/>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

export default function StudyGuidePage() {
    const {user} = useAuth();
    const [activeId, setActiveId] = useState(STUDY_GUIDE_MODULES[0].id);
    const isPremium = Boolean(user?.is_premium);
    const lessonCount = STUDY_GUIDE_MODULES.reduce((total, module) => total + module.pages.length, 0);
    const readyCount = STUDY_GUIDE_MODULES.reduce(
        (total, module) => total + module.pages.filter((page) => page.slug).length,
        0,
    );
    const isLocked = (index) => !isPremium && index >= 3;

    const goToModule = (moduleId) => {
        setActiveId(moduleId);
        document.getElementById(`module-${moduleId}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
            <SEO
                title="SAT Math Study Guide"
                description="Focused SAT Math study guide modules with concise lessons and guided examples."
                path="/study_guides"
                noindex
            />
            <PageContainer className="max-w-7xl">
                <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="m-0 flex items-center gap-2 text-xs font-black uppercase text-primary-700">
                            <BookOpen className="size-4"/> Study Guide
                        </p>
                        <h1 className="m-0 mt-2 font-display text-3xl font-black text-slate-950 sm:text-4xl">
                            SAT Math
                        </h1>
                        <p className="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                            {STUDY_GUIDE_MODULES.length} focused modules, {lessonCount} lessons planned, {readyCount} ready to study.
                        </p>
                    </div>
                    <Button to="/infinite_questions" size="sm">
                        Practice questions
                    </Button>
                </header>

                <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
                    <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
                        <Card className="max-h-[calc(100vh-3rem)] overflow-y-auto p-3">
                            <div className="px-2 py-2">
                                <p className="m-0 text-xs font-black uppercase text-slate-400">Modules</p>
                            </div>
                            <div className="space-y-1">
                                {STUDY_GUIDE_MODULES.map((module, index) => (
                                    <ModuleButton
                                        key={module.id}
                                        module={module}
                                        active={module.id === activeId}
                                        locked={isLocked(index)}
                                        onClick={() => goToModule(module.id)}
                                    />
                                ))}
                            </div>
                        </Card>
                    </aside>

                    <main className="min-w-0 space-y-5">
                        {STUDY_GUIDE_MODULES.map((module, index) => (
                            <ModuleSection
                                key={module.id}
                                module={module}
                                index={index}
                                locked={isLocked(index)}
                            />
                        ))}
                    </main>
                </div>
            </PageContainer>
        </div>
    );
}
