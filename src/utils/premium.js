// Helpers for the Premium state the backend reports in `profile.premium`
// (api/views/profile_views.py _current_profile_payload).

export function isOnFreeWeek(profile) {
    return Boolean(profile?.premium?.on_free_week);
}

// "Tue, Nov 18, 9:41 PM" in the viewer's locale. The free week ends at the
// exact minute it was claimed, so the time matters as much as the day.
export function formatPremiumEnd(iso, locale = undefined) {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}
