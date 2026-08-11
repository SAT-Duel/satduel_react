import React, {useEffect, useState} from 'react';
import {Megaphone, X} from 'lucide-react';
import api from './api';

function dismissalKey(userId) {
    return `sd:announcement-dismissed:${userId}`;
}

export default function AnnouncementBanner({userId}) {
    const [announcement, setAnnouncement] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = () => {
            api.get('/api/announcement/')
                .then(({data}) => {
                    if (!mounted) return;
                    if (!data) {
                        setAnnouncement(null);
                        return;
                    }
                    let dismissedVersion = null;
                    try {
                        dismissedVersion = window.localStorage.getItem(dismissalKey(userId));
                    } catch {
                        // The banner still works when browser storage is unavailable.
                    }
                    setAnnouncement(dismissedVersion === data.version ? null : data);
                })
                .catch(() => {
                    // An announcement should never stop the app from loading.
                });
        };
        load();
        window.addEventListener('announcement-updated', load);
        return () => {
            mounted = false;
            window.removeEventListener('announcement-updated', load);
        };
    }, [userId]);

    if (!announcement) return null;

    const dismiss = () => {
        try {
            window.localStorage.setItem(dismissalKey(userId), announcement.version);
        } catch {
            // Dismiss for this page view even if the preference cannot persist.
        }
        setAnnouncement(null);
    };

    return (
        <section aria-label="Site announcement" className="border-b border-primary-200 bg-primary-50 text-primary-950">
            <div className="mx-auto flex min-h-11 max-w-6xl items-center gap-3 px-4 py-2 sm:px-6">
                <Megaphone className="size-4 shrink-0 text-primary-600" aria-hidden="true"/>
                <p className="m-0 min-w-0 flex-1 whitespace-pre-wrap text-sm font-semibold leading-5">
                    {announcement.message}
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss announcement"
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-primary-700 transition-colors hover:bg-primary-100"
                >
                    <X className="size-4"/>
                </button>
            </div>
        </section>
    );
}
