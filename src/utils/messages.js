// Unread state is polled by the sidebar badge, but reading a thread should
// clear it immediately rather than waiting for the next poll. Pages that change
// unread state fire this event; the badge listens for it.
export const MESSAGES_UPDATED_EVENT = 'sd:messages-updated';

export function notifyMessagesUpdated() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event(MESSAGES_UPDATED_EVENT));
}
