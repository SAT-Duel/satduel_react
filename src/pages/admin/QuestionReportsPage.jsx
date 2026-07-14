import React, {useEffect, useState} from 'react';
import {Eye, Flag, Trash2} from 'lucide-react';
import api from '../../components/api';
import PracticeQuestionCard from '../../components/practice/PracticeQuestionCard';
import {Button, Card, ModalShell, PageContainer, Spinner} from '../../components/ui';
import withAuth from '../../hoc/withAuth';
import {notify} from '../../utils/notify';

function correctAnswer(question) {
    const index = 'ABCD'.indexOf(question?.answer);
    return question?.choices?.[index] || '';
}

function QuestionReportsPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        api.get('/api/admin/question_reports/')
            .then(({data}) => setReports(data || []))
            .catch(() => notify.error('Failed to load question reports.'))
            .finally(() => setLoading(false));
    }, []);

    const deleteReport = async (report) => {
        if (!window.confirm(`Delete report #${report.id}?`)) return;
        try {
            await api.delete(`/api/admin/question_reports/${report.id}/`);
            setReports((current) => current.filter(({id}) => id !== report.id));
            if (selectedReport?.id === report.id) setSelectedReport(null);
            notify.success('Report deleted.');
        } catch {
            notify.error('Failed to delete the report.');
        }
    };

    return (
        <PageContainer className="min-h-screen py-6 sm:py-8">
            <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                    <Flag className="size-3.5"/> Content Review
                </div>
                <h1 className="text-3xl font-black text-slate-950">Question Reports</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Review reported questions and remove reports after they have been handled.
                </p>
            </div>

            {loading ? (
                <Card className="flex min-h-72 items-center justify-center"><Spinner/></Card>
            ) : reports.length === 0 ? (
                <Card className="p-10 text-center">
                    <Flag className="mx-auto size-8 text-slate-300"/>
                    <h2 className="mt-3 text-lg font-black text-slate-900">No question reports</h2>
                    <p className="mt-1 text-sm text-slate-500">Reported content will appear here.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {reports.map((report) => (
                        <Card key={report.id} className="p-4 sm:p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
                                            {report.reason_label}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-400">
                                            Report #{report.id} · Question #{report.question.id}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-700">{report.details}</p>
                                    <p className="mt-2 text-xs font-semibold text-slate-400">
                                        {report.reporter} · {new Date(report.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => setSelectedReport(report)}>
                                        <Eye className="size-4"/> Preview
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => deleteReport(report)}>
                                        <Trash2 className="size-4"/> Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <ModalShell
                open={Boolean(selectedReport)}
                title={selectedReport ? `Reported question #${selectedReport.question.id}` : ''}
                onClose={() => setSelectedReport(null)}
                maxWidth="max-w-4xl"
                footer={<Button variant="secondary" onClick={() => setSelectedReport(null)}>Close</Button>}
            >
                {selectedReport && (
                    <PracticeQuestionCard
                        question={selectedReport.question}
                        selectedChoice={correctAnswer(selectedReport.question)}
                        status="Correct"
                        correctAnswer={correctAnswer(selectedReport.question)}
                        explanation={selectedReport.question.explanation || 'No explanation has been provided for this question.'}
                        allowReporting={false}
                    />
                )}
            </ModalShell>
        </PageContainer>
    );
}

export default withAuth(QuestionReportsPage, true);
