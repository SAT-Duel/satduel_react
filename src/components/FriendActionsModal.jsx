import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {MessageCircle, UserMinus, UserRound} from 'lucide-react';
import {Alert, Button, ModalShell} from './ui';
import UserAvatar from './UserAvatar';
import api from './api';

const GRADE_LABELS = {
    '<1': 'Below Grade 1',
    '>12': 'Above Grade 12',
};

function gradeLabel(value) {
    if (!value) return 'Grade not set';
    return GRADE_LABELS[value] || `Grade ${value}`;
}

/**
 * The three things you can do with a friend: chat, open their profile, or drop
 * the friendship. Opened by tapping a row in the friends list.
 */
export default function FriendActionsModal({friend, unreadCount = 0, onClose, onRemoved}) {
    const navigate = useNavigate();
    const [confirmingRemove, setConfirmingRemove] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState('');

    const friendUserId = friend?.user?.id;

    useEffect(() => {
        setConfirmingRemove(false);
        setError('');
    }, [friendUserId]);

    if (!friend) return null;

    const username = friend.user?.username || 'This student';

    // Viewing a profile keeps ProfilePage mounted, so the menu has to be
    // dismissed explicitly or it lingers on top of the page you navigated to.
    const goTo = (path) => {
        onClose?.();
        navigate(path);
    };

    const removeFriend = async () => {
        setRemoving(true);
        setError('');
        try {
            await api.post('api/profile/remove_friend/', {friend_id: friendUserId});
            onRemoved?.(friend);
            onClose?.();
        } catch (err) {
            setError(err.response?.data?.detail || 'Could not remove this friend. Please try again.');
        } finally {
            setRemoving(false);
        }
    };

    return (
        <ModalShell open title={username} onClose={onClose} maxWidth="max-w-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <UserAvatar profile={friend} size="md"/>
                <div className="min-w-0">
                    <p className="m-0 text-sm font-bold text-slate-700">{gradeLabel(friend.grade)}</p>
                    <p className="m-0 text-sm text-slate-500">{friend.elo_rating ?? '—'} Duel Elo</p>
                </div>
            </div>

            {error && <div className="mt-4"><Alert>{error}</Alert></div>}

            {confirmingRemove ? (
                <div className="mt-5">
                    <p className="m-0 text-sm font-semibold text-slate-800">Remove {username} from your friends?</p>
                    <p className="m-0 mt-1 text-sm text-slate-500">
                        You will not be able to message each other until you are friends again. Your chat history is kept.
                    </p>
                    {/* Stacked rather than side by side: the modal is narrow and
                        "Remove friend" wraps in a half-width button. */}
                    <div className="mt-4 space-y-2">
                        <Button variant="danger" block onClick={removeFriend} loading={removing}>
                            <UserMinus className="size-4"/> Remove friend
                        </Button>
                        <Button variant="secondary" block onClick={() => setConfirmingRemove(false)} disabled={removing}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mt-5 space-y-2">
                    <Button block onClick={() => goTo(`/messages/${friendUserId}`)}>
                        <MessageCircle className="size-4"/> Chat
                        {unreadCount > 0 && (
                            <span className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-xs font-black">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </Button>
                    <Button variant="secondary" block onClick={() => goTo(`/profile/${friendUserId}`)}>
                        <UserRound className="size-4"/> View profile
                    </Button>
                    <Button variant="ghost" block className="text-rose-600 hover:bg-rose-50" onClick={() => setConfirmingRemove(true)}>
                        <UserMinus className="size-4"/> Remove friend
                    </Button>
                </div>
            )}
        </ModalShell>
    );
}
