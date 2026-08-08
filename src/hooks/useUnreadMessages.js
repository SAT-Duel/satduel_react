import {useCallback, useEffect, useState} from 'react';
import api from '../components/api';
import {MESSAGES_UPDATED_EVENT} from '../utils/messages';

const POLL_INTERVAL_MS = 20000;

/**
 * Total unread direct messages, for the sidebar badge.
 *
 * There is no websocket layer, so this polls slowly in the background and
 * refreshes on tab focus. Reading a thread fires MESSAGES_UPDATED_EVENT, which
 * drops the badge right away instead of waiting for the next tick.
 */
export default function useUnreadMessages(enabled = true) {
    const [unreadCount, setUnreadCount] = useState(0);

    const refresh = useCallback(async () => {
        try {
            const {data} = await api.get('api/messages/unread_count/');
            setUnreadCount(data.unread_count || 0);
        } catch {
            // A missed badge refresh should never break navigation.
        }
    }, []);

    useEffect(() => {
        if (!enabled) {
            setUnreadCount(0);
            return undefined;
        }

        refresh();
        const interval = setInterval(refresh, POLL_INTERVAL_MS);
        const onFocus = () => refresh();
        window.addEventListener('focus', onFocus);
        window.addEventListener(MESSAGES_UPDATED_EVENT, refresh);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', onFocus);
            window.removeEventListener(MESSAGES_UPDATED_EVENT, refresh);
        };
    }, [enabled, refresh]);

    return {unreadCount, refreshUnreadCount: refresh};
}
