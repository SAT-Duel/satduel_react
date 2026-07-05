import React from 'react';
import {CheckCircle2, Info, XCircle} from 'lucide-react';
import {Button, Card, Spinner} from '../ui';
import RenderWithMath from '../RenderWithMath';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

function normalizeStatus(status) {
    const value = String(status || 'Blank').toLowerCase();
    if (value === 'correct') return 'correct';
    if (value === 'incorrect') return 'incorrect';
    return 'blank';
}

function getChoices(question) {
    if (question?.choices?.length) return question.choices;
    return [question?.choice_a, question?.choice_b, question?.choice_c, question?.choice_d].filter(Boolean);
}

function PracticeQuestionCard({
    question,
    questionNumber,
    totalQuestions,
    selectedChoice,
    onSelectChoice,
    onSubmit,
    status = 'Blank',
    disabled = false,
    checking = false,
    submitOnSelect = false,
    submitLabel = 'Submit',
    correctAnswer,
    correctChoiceLabel,
    explanation,
    primaryAction,
    primaryActionLabel,
    className = '',
}) {
    const normalizedStatus = normalizeStatus(status);
    const answered = normalizedStatus !== 'blank';
    const choices = getChoices(question);

    const choose = (choice) => {
        if (answered || disabled || checking) return;
        onSelectChoice?.(choice);
        if (submitOnSelect) {
            onSubmit?.(choice);
        }
    };

    const submit = () => {
        if (!selectedChoice || answered || disabled || checking) return;
        onSubmit?.(selectedChoice);
    };

    return (
        <div className={className}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="m-0 text-sm font-semibold text-slate-500">
                        Question {questionNumber || 1}{totalQuestions ? ` of ${totalQuestions}` : ''}
                    </p>
                    {(question?.question_type || question?.difficulty) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {question?.question_type && (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                    {question.question_type}
                                </span>
                            )}
                            {question?.difficulty && (
                                <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                                    Level {question.difficulty}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {totalQuestions && (
                    <div className="flex gap-1.5">
                        {Array.from({length: totalQuestions}).map((_, i) => (
                            <span
                                key={i}
                                className={`h-2 w-8 rounded-full ${
                                    i < questionNumber ? 'bg-primary-500' : 'bg-slate-200'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Card className="p-5 sm:p-8">
                <div className="text-[16px] leading-relaxed text-slate-800">
                    <RenderWithMath text={question?.question || ''}/>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    {choices.map((choice, index) => {
                        const isSelected = selectedChoice === choice;
                        const isCorrectChoice = correctAnswer && choice === correctAnswer;
                        let style = 'border-slate-200 bg-white hover:border-primary-400 hover:bg-primary-50/30';

                        if (answered) {
                            if (isCorrectChoice) {
                                style = 'border-emerald-400 bg-emerald-50';
                            } else if (isSelected && normalizedStatus === 'incorrect') {
                                style = 'border-rose-400 bg-rose-50';
                            } else {
                                style = 'border-slate-200 bg-white opacity-70';
                            }
                        } else if (isSelected) {
                            style = 'border-primary-400 bg-primary-50';
                        }

                        return (
                            <button
                                key={`${question?.id || 'question'}-${index}`}
                                type="button"
                                onClick={() => choose(choice)}
                                disabled={answered || disabled || checking}
                                className={`flex min-h-[4rem] w-full cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-all disabled:cursor-default ${style}`}
                            >
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                                    {CHOICE_LABELS[index] || index + 1}
                                </span>
                                <span className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-800">
                                    <RenderWithMath text={choice}/>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {answered && (
                    <div
                        className={`mt-6 rounded-xl border px-4 py-3 ${
                            normalizedStatus === 'correct'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-rose-200 bg-rose-50 text-rose-700'
                        }`}
                    >
                        <div className="flex items-center gap-2 font-semibold">
                            {normalizedStatus === 'correct'
                                ? <CheckCircle2 className="size-5"/>
                                : <XCircle className="size-5"/>}
                            {normalizedStatus === 'correct'
                                ? 'Correct!'
                                : correctChoiceLabel
                                    ? `Not quite. ${correctChoiceLabel} is the correct answer.`
                                    : 'Not quite. Your answer was saved.'}
                        </div>
                    </div>
                )}

                {answered && explanation && (
                    <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[15px] leading-relaxed text-sky-900">
                        <div className="mb-2 flex items-center gap-2 font-semibold text-sky-800">
                            <Info className="size-4"/> Explanation
                        </div>
                        <RenderWithMath text={explanation}/>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    {!answered && !submitOnSelect && !disabled && (
                        <Button onClick={submit} disabled={!selectedChoice || checking}>
                            {checking && <Spinner className="size-4 border-2"/>}
                            {submitLabel}
                        </Button>
                    )}
                    {answered && primaryAction && (
                        <Button onClick={primaryAction}>
                            {primaryActionLabel}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default PracticeQuestionCard;
