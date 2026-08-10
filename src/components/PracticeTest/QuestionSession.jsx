import React, {useCallback, useEffect, useRef, useState} from 'react';
import TestHeader from './TestHeader';
import QuestionContent from './QuestionContent';
import AnswerSection from './AnswerSection';
import ReviewPage from './ReviewPage';
import TestNavigation from './TestNavigation';
import AnnotationToolbar from './AnnotationToolbar';
import {applyAnnotation} from '../../utils/practiceTestAnnotations';
import {Button, ModalShell} from '../ui';

const emptyAnswers = (total) => Object.fromEntries(Array.from({length: total}, (_, index) => [index + 1, null]));
const secondsUntil = (deadlineAt) => Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
const emptyTools = () => ({marks: [], crossed_out: []});

export default function QuestionSession({
    questions,
    onSubmit,
    initialSeconds = null,
    deadlineAt = null,
    initialProgress = null,
    onProgressChange,
    onProgressPersist,
    title,
    statusLabel,
    navigationTitle,
    reviewDescription,
    variant = 'test',
    onQuit = null,
    showDesmos = false,
    sectionNumber = 1,
    moduleNumber = 1,
}) {
    const totalQuestions = questions.length;
    const [currentQuestion, setCurrentQuestion] = useState(() => Math.min(Math.max(Number(initialProgress?.currentQuestion) || 1, 1), totalQuestions + 1));
    const [selectedAnswers, setSelectedAnswers] = useState(() => ({...emptyAnswers(totalQuestions), ...(initialProgress?.answers || initialProgress?.selectedAnswers || {})}));
    const [reviewQuestions, setReviewQuestions] = useState(() => Array.isArray(initialProgress?.reviewQuestions) ? initialProgress.reviewQuestions : []);
    const [annotations, setAnnotations] = useState(() => initialProgress?.annotations || {});
    const [timeLeft, setTimeLeft] = useState(() => deadlineAt == null ? initialSeconds : secondsUntil(deadlineAt));
    const [hideTimer, setHideTimer] = useState(Boolean(initialProgress?.hideTimer));
    const [highlighterActive, setHighlighterActive] = useState(false);
    const [eliminatorActive, setEliminatorActive] = useState(false);
    const [activeAnnotation, setActiveAnnotation] = useState(null);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const autoSubmitted = useRef(false);

    const answeredQuestions = Object.entries(selectedAnswers)
        .filter(([, answer]) => answer !== null && answer !== '')
        .map(([number]) => Number(number));

    const currentState = useCallback(() => ({
        currentQuestion,
        reviewQuestions,
        annotations,
        timeLeft: deadlineAt == null ? timeLeft : secondsUntil(deadlineAt),
        hideTimer,
    }), [annotations, currentQuestion, deadlineAt, hideTimer, reviewQuestions, timeLeft]);

    const submit = useCallback(() => onSubmit(selectedAnswers, currentState()), [currentState, onSubmit, selectedAnswers]);
    const goToQuestion = useCallback((questionNumber) => {
        if (questionNumber === currentQuestion) return;
        onProgressPersist?.(selectedAnswers, currentState());
        setCurrentQuestion(questionNumber);
    }, [currentQuestion, currentState, onProgressPersist, selectedAnswers]);

    useEffect(() => {
        if (deadlineAt == null) return undefined;
        const updateTimer = () => setTimeLeft(secondsUntil(deadlineAt));
        updateTimer();
        const timerId = window.setInterval(updateTimer, 250);
        document.addEventListener('visibilitychange', updateTimer);
        window.addEventListener('focus', updateTimer);
        return () => {
            window.clearInterval(timerId);
            document.removeEventListener('visibilitychange', updateTimer);
            window.removeEventListener('focus', updateTimer);
        };
    }, [deadlineAt]);

    useEffect(() => {
        onProgressChange?.(selectedAnswers, {currentQuestion, reviewQuestions, annotations, timeLeft, hideTimer});
        // Absolute deadlines own timer persistence, so timer ticks do not write storage.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annotations, currentQuestion, hideTimer, onProgressChange, reviewQuestions, selectedAnswers]);

    useEffect(() => {
        const persistOnDeparture = () => onProgressPersist?.(selectedAnswers, currentState());
        const persistWhenHidden = () => {
            if (document.visibilityState === 'hidden') persistOnDeparture();
        };
        window.addEventListener('pagehide', persistOnDeparture);
        document.addEventListener('visibilitychange', persistWhenHidden);
        return () => {
            window.removeEventListener('pagehide', persistOnDeparture);
            document.removeEventListener('visibilitychange', persistWhenHidden);
        };
    }, [currentState, onProgressPersist, selectedAnswers]);

    useEffect(() => {
        setActiveAnnotation(null);
    }, [currentQuestion]);

    useEffect(() => {
        if (initialSeconds != null && timeLeft === 0 && !autoSubmitted.current) {
            autoSubmitted.current = true;
            submit();
        }
    }, [initialSeconds, submit, timeLeft]);

    const questionKey = String(currentQuestion);
    const tools = annotations[questionKey] || emptyTools();
    const updateTools = (next) => setAnnotations((previous) => ({...previous, [questionKey]: next}));

    const createMark = ({field, start, end, rect}) => {
        const mark = {
            id: window.crypto?.randomUUID?.() || `${Date.now()}-${start}`,
            field,
            start,
            end,
            color: 'yellow',
            underline: 'none',
        };
        updateTools({...tools, marks: applyAnnotation(tools.marks || [], mark)});
        setActiveAnnotation({id: mark.id, rect});
    };

    const openMark = (mark, rect) => setActiveAnnotation({id: mark.id, rect});
    const activeMark = tools.marks?.find((mark) => mark.id === activeAnnotation?.id);
    const changeActiveMark = (next) => updateTools({...tools, marks: tools.marks.map((mark) => mark.id === next.id ? next : mark)});
    const deleteActiveMark = () => {
        updateTools({...tools, marks: tools.marks.filter((mark) => mark.id !== activeAnnotation.id)});
        setActiveAnnotation(null);
    };

    const activeQuestion = questions[currentQuestion - 1];
    const mistakeMode = variant === 'mistakes';
    const hasSeparateContext = activeQuestion?.question?.includes('\n');

    return (
        <div className={`min-h-screen pb-20 ${mistakeMode ? 'bg-primary-50/60' : 'bg-white'}`}>
            <TestHeader
                timeLeft={initialSeconds == null ? null : timeLeft}
                hideTimer={hideTimer}
                onToggleHide={() => setHideTimer((hidden) => !hidden)}
                sectionNumber={sectionNumber}
                moduleNumber={moduleNumber}
                title={title}
                statusLabel={statusLabel}
                showDesmos={showDesmos}
                highlighterActive={highlighterActive}
                onToggleHighlighter={mistakeMode ? null : () => setHighlighterActive((active) => !active)}
                onQuit={onQuit ? () => onQuit(selectedAnswers, currentState()) : null}
            />

            {currentQuestion <= totalQuestions && activeQuestion && (
                <main className={`mx-auto grid min-h-[calc(100vh-9.5rem)] w-full max-w-[1500px] ${hasSeparateContext ? 'lg:grid-cols-2 lg:divide-x-2 lg:divide-slate-500' : 'max-w-3xl'}`}>
                    {hasSeparateContext && (
                        <section className="border-b-2 border-slate-300 bg-white lg:border-b-0">
                            <QuestionContent question={activeQuestion} marks={tools.marks} highlighterActive={highlighterActive} onCreateMark={createMark} onOpenMark={openMark}/>
                        </section>
                    )}
                    <section className="bg-white">
                        <AnswerSection
                            question={activeQuestion}
                            currentQuestion={currentQuestion}
                            selectedAnswer={selectedAnswers}
                            setSelectedAnswer={setSelectedAnswers}
                            reviewQuestions={reviewQuestions}
                            setReviewQuestions={setReviewQuestions}
                            tools={tools}
                            onToolsChange={updateTools}
                            highlighterActive={highlighterActive}
                            onCreateMark={createMark}
                            onOpenMark={openMark}
                            eliminatorActive={eliminatorActive}
                            onToggleEliminator={() => setEliminatorActive((active) => !active)}
                        />
                    </section>
                </main>
            )}

            {currentQuestion > totalQuestions && (
                <ReviewPage currentQuestion={currentQuestion} totalQuestions={totalQuestions} setCurrentQuestion={goToQuestion} reviewQuestions={reviewQuestions} answeredQuestions={answeredQuestions} description={reviewDescription} navigationTitle={navigationTitle}/>
            )}

            <TestNavigation currentQuestion={currentQuestion} totalQuestions={totalQuestions} setCurrentQuestion={goToQuestion} reviewQuestions={reviewQuestions} answeredQuestions={answeredQuestions} onSubmit={mistakeMode ? submit : () => setConfirmSubmit(true)} navigationTitle={navigationTitle}/>

            <AnnotationToolbar mark={activeMark} rect={activeAnnotation?.rect} onChange={changeActiveMark} onDelete={deleteActiveMark}/>

            <ModalShell
                open={confirmSubmit}
                title="Submit this module?"
                onClose={() => setConfirmSubmit(false)}
                footer={(
                    <>
                        <Button variant="secondary" onClick={() => setConfirmSubmit(false)}>Keep reviewing</Button>
                        <Button onClick={() => {
                            setConfirmSubmit(false);
                            submit();
                        }}>Submit module</Button>
                    </>
                )}
            >
                <p className="m-0 text-sm leading-6 text-slate-600">
                    You still have time to review your answers. Once you submit, you cannot return to this module.
                </p>
            </ModalShell>
        </div>
    );
}
