/**
 * Hand a link to the OS share sheet, falling back to the clipboard.
 *
 * Phones get the native sheet (Messages, Snapchat, Discord, ...), which is
 * where invites are actually sent. Desktop browsers mostly lack it, so the
 * link is copied instead.
 *
 * Returns what happened so the caller can word its own toast:
 *   'shared'    the sheet opened and the user picked a target
 *   'copied'    the link is on the clipboard
 *   'cancelled' the user dismissed the sheet (not an error, say nothing)
 *   'failed'    neither route worked; show the link so it can be copied by hand
 */
export async function shareLink({title, text, url}) {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
            await navigator.share({title, text, url});
            return 'shared';
        } catch (error) {
            if (error?.name === 'AbortError') return 'cancelled';
            // Any other failure (permission, unsupported payload) falls through to copy.
        }
    }
    try {
        await navigator.clipboard.writeText(url);
        return 'copied';
    } catch {
        return 'failed';
    }
}

export default shareLink;
