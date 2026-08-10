import React, {useEffect, useState} from 'react';
import {ArrowLeft, Megaphone, Save} from 'lucide-react';
import api from '../../components/api';
import {Button, Card, PageContainer, Spinner, Textarea, Toggle} from '../../components/ui';
import withAuth from '../../hoc/withAuth';
import {notify} from '../../utils/notify';

function AnnouncementPage() {
    const [form, setForm] = useState({message: '', is_active: false});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/api/admin/announcement/')
            .then(({data}) => setForm({message: data.message || '', is_active: data.is_active}))
            .catch(() => notify.error('Failed to load the announcement.'))
            .finally(() => setLoading(false));
    }, []);

    const save = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const {data} = await api.put('/api/admin/announcement/', form);
            setForm({message: data.message, is_active: data.is_active});
            window.dispatchEvent(new Event('announcement-updated'));
            notify.success(data.is_active ? 'Announcement published.' : 'Announcement saved and hidden.');
        } catch (error) {
            notify.error(error.response?.data?.error || 'Failed to save the announcement.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex min-h-[50vh] items-center justify-center"><Spinner/></div>;
    }

    return (
        <PageContainer maxWidth="max-w-3xl" className="min-h-screen py-6 sm:py-8">
            <Button to="/admin" variant="ghost" size="sm" className="mb-5 -ml-2">
                <ArrowLeft className="size-4"/> Admin tools
            </Button>

            <div className="mb-7">
                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                    <Megaphone className="size-6"/>
                </div>
                <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">Site announcement</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Publish one short message across the signed-in app. Saving a change shows the new version again to users who dismissed the old one.
                </p>
            </div>

            <form onSubmit={save}>
                <Card className="space-y-5 p-5 sm:p-6">
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-slate-700">Banner message</span>
                        <Textarea
                            value={form.message}
                            onChange={(event) => setForm({...form, message: event.target.value})}
                            placeholder="New full-length practice test is live 🎉"
                            maxLength={500}
                            rows={5}
                        />
                        <span className="mt-1.5 block text-right text-xs text-slate-400">{form.message.length}/500</span>
                    </label>

                    <Toggle
                        checked={form.is_active}
                        onChange={(is_active) => setForm({...form, is_active})}
                        label="Active"
                        description="Show this announcement to signed-in users."
                    />

                    <div className="flex justify-end border-t border-slate-100 pt-5">
                        <Button type="submit" loading={saving} disabled={form.is_active && !form.message.trim()}>
                            <Save className="size-4"/> Save announcement
                        </Button>
                    </div>
                </Card>
            </form>

            {form.message.trim() && (
                <div className="mt-6">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Preview</p>
                    <div className="flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-950">
                        <Megaphone className="mt-0.5 size-5 shrink-0 text-primary-600"/>
                        <p className="m-0 whitespace-pre-wrap text-sm font-semibold leading-5">{form.message}</p>
                    </div>
                </div>
            )}
        </PageContainer>
    );
}

export default withAuth(AnnouncementPage, true);
