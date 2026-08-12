import React, {useEffect, useState} from 'react';
import {
    ArrowRight,
    ChevronDown,
    Clock3,
    Lock,
} from 'lucide-react';
import {Link, useSearchParams} from 'react-router-dom';
import SEO from '../components/SEO';
import {Button, Card, PageContainer, Select} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import {ENGLISH_STUDY_GUIDE_MODULES} from '../content/englishStudyGuideModules';
import {STUDY_GUIDE_MODULES} from '../content/studyGuideModules';

const SUBJECTS = {
    math: {
        label: 'Math',
        heading: 'SAT Math',
        description: 'Build concept fluency with concise lessons, guided examples, and a clear path through every math domain.',
        modules: STUDY_GUIDE_MODULES,
    },
    english: {
        label: 'English',
        heading: 'SAT English',
        description: 'Learn a repeatable Reading and Writing process, then master every tested skill with evidence-first lessons and focused practice.',
        modules: ENGLISH_STUDY_GUIDE_MODULES,
    },
};

function SubjectSwitcher({subject, onChange}) {
    return (
        <div role="tablist" className="flex border-b border-slate-200" aria-label="Study guide subject">
            {Object.entries(SUBJECTS).map(([id, item]) => {
                const active = id === subject;

                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-pressed={active}
                        aria-selected={active}
                        onClick={() => onChange(id)}
                        className={[
                            '-mb-px min-h-11 cursor-pointer border-b-2 px-5 text-sm font-black transition-colors',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
                            active
                                ? 'border-primary-600 text-primary-700'
                                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-950',
                        ].join(' ')}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}

function ModuleButton({module, index, active, locked, onClick}) {

    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={active ? 'true' : undefined}
            className={[
                'w-full cursor-pointer rounded-lg px-3 py-2.5 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
                active
                    ? 'bg-primary-50 text-primary-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950',
            ].join(' ')}
        >
            <div className="flex items-center gap-3">
                <span className={[
                    'flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-black',
                    active ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500',
                ].join(' ')}>
                    {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-black">{module.title}</span>
                        {locked && <Lock className="size-3.5 shrink-0 text-slate-400"/>}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">
                        {module.domain}
                    </span>
                </span>
            </div>
        </button>
    );
}

function LessonRow({page, index}) {
    const content = (
        <>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">
                {index + 1}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block font-black text-slate-950">{page.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-500">{page.focus}</span>
            </span>
            {page.slug ? (
                <ArrowRight className="size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-500"/>
            ) : (
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-500">
                    Planned
                </span>
            )}
        </>
    );

    if (!page.slug) {
        return <div className="flex items-start gap-3 px-5 py-4">{content}</div>;
    }

    return (
        <Link
            to={`/study_guides/${page.slug}`}
            className="group flex items-start gap-3 px-5 py-4 no-underline transition-colors hover:bg-primary-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
        >
            {content}
        </Link>
    );
}

function ModuleSection({module, index, locked, sectionId}) {
    const Icon = module.icon;

    return (
        <Card id={sectionId} className="scroll-mt-6 overflow-hidden">
            <div className="bg-white px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${module.accent}`}>
                            <Icon className="size-5"/>
                        </span>
                        <div>
                            <p className="m-0 text-xs font-black uppercase text-slate-500">Module {index + 1} · {module.domain}</p>
                            <h2 className="m-0 mt-1 font-display text-2xl font-black text-slate-950">{module.title}</h2>
                            <p className="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{module.summary}</p>
                        </div>
                    </div>
                    {module.comingSoon ? (
                        <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700">
                            Curriculum preview
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
                            <Clock3 className="size-3.5"/>
                            {module.time}
                        </span>
                    )}
                </div>
            </div>

            {locked ? (
                <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
            ) : (
                <div className="divide-y divide-slate-100 border-t border-slate-100">
                    {module.pages.map((page, pageIndex) => (
                        <LessonRow key={page.title} page={page} index={pageIndex}/>
                    ))}
                </div>
            )}
        </Card>
    );
}

export default function StudyGuidePage() {
    const {user} = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSubject = searchParams.get('subject') === 'english' ? 'english' : 'math';
    const [subject, setSubject] = useState(initialSubject);
    const subjectDetails = SUBJECTS[subject];
    const modules = subjectDetails.modules;
    const [activeId, setActiveId] = useState(modules[0].id);
    const isPremium = Boolean(user?.is_premium);
    const lessonCount = modules.reduce((total, module) => total + module.pages.length, 0);
    const readyCount = modules.reduce(
        (total, module) => total + module.pages.filter((page) => page.slug).length,
        0,
    );
    const isLocked = (index) => subject === 'math' && !isPremium && index >= 3;
    const sectionId = (moduleId) => `module-${subject}-${moduleId}`;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.dataset.moduleId);
                    }
                });
            },
            {rootMargin: '-10% 0px -75% 0px'},
        );

        modules.forEach((module) => {
            const section = document.getElementById(sectionId(module.id));
            if (section) {
                section.dataset.moduleId = module.id;
                observer.observe(section);
            }
        });

        return () => observer.disconnect();
    }, [modules, subject]);

    const changeSubject = (nextSubject) => {
        setSubject(nextSubject);
        setActiveId(SUBJECTS[nextSubject].modules[0].id);
        setSearchParams(nextSubject === 'english' ? {subject: 'english'} : {}, {replace: true});
    };

    const goToModule = (moduleId) => {
        setActiveId(moduleId);
        document.getElementById(sectionId(moduleId))?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
            <SEO
                title={`${subjectDetails.heading} Study Guide`}
                description={subjectDetails.description}
                path="/study_guides"
                noindex
            />
            <PageContainer maxWidth="max-w-7xl">
                <header className="mb-6 border-b border-slate-200 pb-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <h1 className="m-0 font-display text-3xl font-black tracking-tight text-slate-950">
                            Study guides
                        </h1>
                        <SubjectSwitcher subject={subject} onChange={changeSubject}/>
                    </div>
                    <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <p className="m-0 max-w-3xl text-sm leading-relaxed text-slate-600">{subjectDetails.description}</p>
                        <p className="m-0 shrink-0 text-xs font-bold text-slate-500">
                            {modules.length} modules · {lessonCount} lessons{readyCount ? ` · ${readyCount} available` : ''}
                        </p>
                    </div>
                </header>

                <label className="mb-5 block lg:hidden">
                    <span className="mb-1.5 block text-xs font-black text-slate-500">Jump to module</span>
                    <span className="relative block">
                        <Select className="pr-10" value={activeId} onChange={(event) => goToModule(event.target.value)}>
                            {modules.map((module, index) => (
                                <option key={module.id} value={module.id}>
                                    {index + 1}. {module.title}{isLocked(index) ? ' · Premium' : ''}
                                </option>
                            ))}
                        </Select>
                        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"/>
                    </span>
                </label>

                <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="hidden min-w-0 lg:sticky lg:top-6 lg:block lg:self-start">
                        <Card className="max-h-[calc(100vh-3rem)] overflow-y-auto p-2">
                            <div className="border-b border-slate-100 px-3 py-3">
                                <p className="m-0 text-sm font-black text-slate-950">On this page</p>
                                <p className="m-0 mt-0.5 text-xs font-semibold text-slate-500">
                                    {modules.length} modules in {subjectDetails.label}
                                </p>
                            </div>
                            <nav className="mt-2 space-y-0.5" aria-label={`${subjectDetails.label} study guide modules`}>
                                {modules.map((module, index) => (
                                    <ModuleButton
                                        key={module.id}
                                        module={module}
                                        index={index}
                                        active={module.id === activeId}
                                        locked={isLocked(index)}
                                        onClick={() => goToModule(module.id)}
                                    />
                                ))}
                            </nav>
                        </Card>
                    </aside>

                    <main className="min-w-0 space-y-5">
                        {modules.map((module, index) => (
                            <ModuleSection
                                key={module.id}
                                module={module}
                                index={index}
                                locked={isLocked(index)}
                                sectionId={sectionId(module.id)}
                            />
                        ))}
                    </main>
                </div>
            </PageContainer>
        </div>
    );
}
