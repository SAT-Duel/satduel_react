import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {
    BookOpenCheck,
    CheckCircle2,
    CircleDot,
    Flame,
    Heart,
    Lightbulb,
    Mail,
    MessageSquare,
    Send,
    ShieldCheck,
    Sparkles,
    Swords,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import emailjs from 'emailjs-com';
import {Alert, Button, Card, Input, PageContainer} from '../components/ui';
import SEO, {breadcrumbJsonLd, organizationJsonLd} from '../components/SEO';
import clement from '../assets/teamphoto/clementzhou.jpg';
import alex from '../assets/teamphoto/alexjin.jpg';
import weiwei from '../assets/teamphoto/weiwei.jpg';
import bryan from '../assets/teamphoto/9dc66da09989aebf1037be575264899c.jpg';

const PRINCIPLES = [
    {
        icon: Target,
        eyebrow: 'Practice loop',
        title: 'Make the next rep obvious',
        text: 'Students should always know what to answer, what changed, and why the next round matters.',
        accent: 'bg-primary-100 text-primary-700',
    },
    {
        icon: Swords,
        eyebrow: 'Duel pressure',
        title: 'Use competition carefully',
        text: 'The arena is motivating because it is clear, scored, and fair. It should never bury the student in noise.',
        accent: 'bg-cyan-100 text-cyan-700',
    },
    {
        icon: Trophy,
        eyebrow: 'Progress signal',
        title: 'Keep score without clutter',
        text: 'Practice rating, duel rating, streak, and answered questions are the core signals worth protecting.',
        accent: 'bg-emerald-100 text-emerald-700',
    },
];

const TEAM = [
    {
        name: 'Clement Zhou',
        role: 'Co-founder & CEO',
        avatar: clement,
        lane: 'Product',
    },
    {
        name: 'Alex Jin',
        role: 'Co-founder & CTO',
        avatar: alex,
        lane: 'Engineering',
    },
    {
        name: 'Weiwei Luo',
        role: 'President & Project Manager',
        avatar: weiwei,
        lane: 'Operations',
    },
    {
        name: 'Bryan Zhou',
        role: 'Marketing & Finance',
        avatar: bryan,
        lane: 'Growth',
    },
];

const VALUES = [
    {
        icon: Lightbulb,
        title: 'Inventive',
        text: 'Build SAT-native interfaces, not generic study dashboards.',
        color: 'text-primary-700 bg-primary-100',
    },
    {
        icon: ShieldCheck,
        title: 'Honest',
        text: 'Use real numbers, clear limits, and progress signals students can trust.',
        color: 'text-emerald-700 bg-emerald-100',
    },
    {
        icon: BookOpenCheck,
        title: 'Useful',
        text: 'Every screen should help a student answer more thoughtfully.',
        color: 'text-cyan-700 bg-cyan-100',
    },
    {
        icon: Heart,
        title: 'Motivating',
        text: 'A little game energy should create momentum, not distraction.',
        color: 'text-rose-700 bg-rose-100',
    },
];

const FAQS = [
    {
        question: 'What is the best way to contact you?',
        answer: 'Send a note through the form or email satduel@gmail.com directly.',
    },
    {
        question: 'How long does it take to get a response?',
        answer: 'We aim to respond within 24-48 hours.',
    },
    {
        question: 'Can I visit your office?',
        answer: 'SAT Duel is online-only right now, so there is no physical office for visits.',
    },
    {
        question: 'Do you offer customer support?',
        answer: 'Yes. Reach out with account, billing, or product questions and we will help.',
    },
];

function ArenaBubbleRow() {
    return (
        <div className="mt-6 grid grid-cols-4 gap-2">
            {['A', 'B', 'C', 'D'].map((choice, index) => (
                <div key={choice} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                    <span
                        className={[
                            'mx-auto flex size-9 items-center justify-center rounded-full text-sm font-black',
                            index === 1
                                ? 'sat-answer-bubble-filled text-white'
                                : 'bg-slate-900 text-slate-400 shadow-[inset_0_0_0_2px_rgba(148,163,184,0.65)]',
                        ].join(' ')}
                    >
                        {choice}
                    </span>
                    <p className="m-0 mt-2 text-xs font-black uppercase text-slate-400">
                        {index === 1 ? 'Focus' : 'Noise'}
                    </p>
                </div>
            ))}
        </div>
    );
}

function PrincipleCard({principle}) {
    const Icon = principle.icon;
    return (
        <Card hover className="sat-arena-card overflow-hidden">
            <div className="p-6">
                <div className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${principle.accent}`}>
                    <Icon className="size-6"/>
                </div>
                <p className="m-0 text-xs font-black uppercase text-slate-400">{principle.eyebrow}</p>
                <h3 className="m-0 mt-2 font-display text-xl font-black text-slate-950">{principle.title}</h3>
                <p className="m-0 mt-3 text-[15px] leading-relaxed text-slate-600">{principle.text}</p>
            </div>
            <div className="sat-score-strip flex items-center justify-between px-6 py-3">
                <span className="text-xs font-black uppercase text-slate-500">Design rule</span>
                <CircleDot className="size-5 text-primary-600"/>
            </div>
        </Card>
    );
}

function TeamCard({member}) {
    return (
        <Card className="sat-arena-card overflow-hidden text-center">
            <div className="sat-score-strip h-3"/>
            <div className="p-5">
                <div className="mx-auto size-28 overflow-hidden rounded-[1.5rem] border-4 border-white bg-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                    <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-full w-full object-cover"
                    />
                </div>
                <h3 className="m-0 mt-4 font-display text-lg font-black text-slate-950">{member.name}</h3>
                <p className="m-0 mt-1 text-sm font-semibold text-slate-600">{member.role}</p>
                <span className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase text-slate-500">
                    {member.lane}
                </span>
            </div>
        </Card>
    );
}

function ValueCard({value}) {
    const Icon = value.icon;
    return (
        <Card className="sat-arena-card p-5">
            <div className={`mb-4 flex size-11 items-center justify-center rounded-2xl ${value.color}`}>
                <Icon className="size-5"/>
            </div>
            <h3 className="m-0 font-display text-lg font-black text-slate-950">{value.title}</h3>
            <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">{value.text}</p>
        </Card>
    );
}

function AboutPage() {
    const {hash} = useLocation();
    const form = useRef(null);
    const [status, setStatus] = useState(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!hash) return;
        const element = document.querySelector(hash);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    }, [hash]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSending(true);
        setStatus(null);
        try {
            await emailjs.sendForm(
                'service_6c2ymlq',
                'template_1qosfaq',
                form.current,
                'eqBzs3BVZxwSyxMQE'
            );
            form.current.reset();
            setStatus({type: 'success', text: 'Email sent successfully. We will get back to you soon.'});
        } catch (error) {
            setStatus({type: 'error', text: 'Failed to send email. You can also email satduel@gmail.com directly.'});
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white text-slate-900">
            <SEO
                title="About SAT Duel"
                description="Meet the SAT Duel team and the mission behind a focused, competitive Digital SAT practice platform."
                path="/about"
                structuredData={[
                    organizationJsonLd(),
                    breadcrumbJsonLd([
                        {name: 'Home', path: '/'},
                        {name: 'About SAT Duel', path: '/about'},
                    ]),
                ]}
            />

            <section id="header" className="sat-arena-surface overflow-hidden border-b border-slate-200">
                <PageContainer className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-14">
                    <div className="text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-sm font-black text-primary-700 shadow-sm">
                            <Sparkles className="size-4"/> Built for focused SAT momentum
                        </span>
                        <h1 className="m-0 mt-5 font-display text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            The SAT should feel less like a pile of worksheets.
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
                            SAT Duel is a practice arena for students who want clear questions, visible progress, and just enough competition to come back tomorrow.
                        </p>
                    </div>

                    <div className="sat-arena-card hidden overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950 text-white lg:block">
                        <div className="p-6">
                            <p className="m-0 text-xs font-black uppercase text-cyan-200">Company score slip</p>
                            <h2 className="m-0 mt-2 font-display text-2xl font-black">Why we are building this</h2>
                            <p className="m-0 mt-3 text-[15px] leading-relaxed text-slate-300">
                                Founded in June 2024, SAT Duel started from a simple belief: SAT prep works better when students can see the next round, the feedback, and the score movement immediately.
                            </p>
                            <ArenaBubbleRow/>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-white/5 px-5 py-4 text-center">
                            <div>
                                <p className="m-0 text-xs font-black uppercase text-slate-400">Founded</p>
                                <p className="m-0 mt-1 font-display text-xl font-black">2024</p>
                            </div>
                            <div>
                                <p className="m-0 text-xs font-black uppercase text-slate-400">Team</p>
                                <p className="m-0 mt-1 font-display text-xl font-black">4</p>
                            </div>
                            <div>
                                <p className="m-0 text-xs font-black uppercase text-slate-400">Mission</p>
                                <p className="m-0 mt-1 font-display text-xl font-black">Focus</p>
                            </div>
                        </div>
                    </div>
                </PageContainer>
            </section>

            <section className="bg-white">
                <PageContainer className="py-12 sm:py-16">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                            <Flame className="size-4 text-amber-300"/> What guides the product
                        </span>
                        <h2 className="m-0 mt-5 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            Calm study. Clear score. One more round.
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {PRINCIPLES.map((principle) => (
                            <PrincipleCard key={principle.title} principle={principle}/>
                        ))}
                    </div>
                </PageContainer>
            </section>

            <section className="sat-bubble-field border-y border-slate-200">
                <PageContainer className="py-12 sm:py-16">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="m-0 text-xs font-black uppercase text-primary-600">Team</p>
                            <h2 className="m-0 mt-2 font-display text-3xl font-black text-slate-950">Meet the builders</h2>
                        </div>
                        <p className="m-0 max-w-xl text-sm leading-relaxed text-slate-600">
                            A small team means every detail matters: question flow, payment trust, mobile layout, and the feeling after a student submits an answer.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {TEAM.map((member) => (
                            <TeamCard key={member.name} member={member}/>
                        ))}
                    </div>
                </PageContainer>
            </section>

            <section className="bg-white">
                <PageContainer className="py-12 sm:py-16">
                    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                                <CheckCircle2 className="size-4"/> Values
                            </span>
                            <h2 className="m-0 mt-5 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                                The small design decisions are the product.
                            </h2>
                            <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                                We want SAT Duel to feel memorable without becoming loud. The answer bubbles, score slips, and duel lanes are there to make learning feel concrete.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {VALUES.map((value) => (
                                <ValueCard key={value.title} value={value}/>
                            ))}
                        </div>
                    </div>
                </PageContainer>
            </section>

            <section id="contact-us" className="sat-bubble-field border-y border-slate-200">
                <PageContainer className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                            <Mail className="size-4 text-cyan-300"/> Contact
                        </span>
                        <h2 className="m-0 mt-5 font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                            Send us a note.
                        </h2>
                        <p className="m-0 mt-4 text-lg leading-relaxed text-slate-600">
                            Product feedback, billing questions, school partnerships, or bug reports all go to the same place.
                        </p>
                        <p className="m-0 mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
                            <MessageSquare className="size-4 text-primary-600"/> satduel@gmail.com
                        </p>
                    </div>

                    <Card className="sat-arena-card p-5 sm:p-6">
                        {status && (
                            <div className="mb-4">
                                <Alert type={status.type}>{status.text}</Alert>
                            </div>
                        )}

                        <form ref={form} onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-black text-slate-700">Name</span>
                                <Input name="name" placeholder="Your name" required/>
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-black text-slate-700">Email</span>
                                <Input name="email" type="email" placeholder="you@example.com" required/>
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-black text-slate-700">Message</span>
                                <textarea
                                    name="message"
                                    rows={5}
                                    placeholder="What should we know?"
                                    required
                                    className="w-full resize-y rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500"
                                />
                            </label>
                            <Button type="submit" block loading={sending}>
                                Send message <Send className="size-4"/>
                            </Button>
                        </form>
                    </Card>
                </PageContainer>
            </section>

            <section id="faq" className="bg-white">
                <PageContainer className="py-12 sm:py-16">
                    <div className="mb-8 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-black text-primary-700">
                            <Users className="size-4"/> FAQ
                        </span>
                        <h2 className="m-0 mt-5 font-display text-3xl font-black text-slate-950">Quick answers</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {FAQS.map((faq) => (
                            <Card key={faq.question} className="sat-arena-card p-5">
                                <h3 className="m-0 text-lg font-black text-slate-950">{faq.question}</h3>
                                <p className="m-0 mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </PageContainer>
            </section>
        </div>
    );
}

export default AboutPage;
