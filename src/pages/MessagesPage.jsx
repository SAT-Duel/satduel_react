import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft, MessageCircle, Send, UserRound, Users} from 'lucide-react';
import withAuth from '../hoc/withAuth';
import api from '../components/api';
import UserAvatar from '../components/UserAvatar';
import {Alert, Button, Card, PageContainer, Spinner, Textarea} from '../components/ui';
import {useAuth} from '../context/AuthContext';
import {notifyMessagesUpdated} from '../utils/messages';

// No websocket layer in this project: an open thread polls for new messages
// with an `after` cursor, and the conversation list refreshes more slowly.
const THREAD_POLL_MS = 4000;
const CONVERSATIONS_POLL_MS = 15000;
const MAX_MESSAGE_LENGTH = 2000;

// Both panes are a fixed height so the composer stays put instead of sliding
// under the mobile tab bar: the subtraction covers the app chrome above and
// below (top bar, page header, bottom nav).
const PANE_HEIGHT = 'h-[calc(100dvh-20rem)] min-h-[20rem] lg:h-[calc(100vh-16rem)] lg:min-h-[26rem] lg:max-h-[46rem]';

const dayFormatter = new Intl.DateTimeFormat(undefined, {weekday: 'short', month: 'short', day: 'numeric'});
const timeFormatter = new Intl.DateTimeFormat(undefined, {hour: 'numeric', minute: '2-digit'});
const shortDateFormatter = new Intl.DateTimeFormat(undefined, {month: 'short', day: 'numeric'});

function dayLabel(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return dayFormatter.format(date);
}

function previewTime(value) {
    const date = new Date(value);
    if (date.toDateString() === new Date().toDateString()) return timeFormatter.format(date);
    return shortDateFormatter.format(date);
}

function UnreadBadge({count}) {
    if (!count) return null;
    return (
        <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-primary-600 px-1.5 py-0.5 text-[11px] font-black text-white">
            {count > 99 ? '99+' : count}
        </span>
    );
}

function ConversationRow({entry, active, onSelect}) {
    const {friend, last_message: lastMessage, unread_count: unread} = entry;
    const preview = lastMessage?.content?.replace(/\s+/g, ' ').trim();

    return (
        <button
            type="button"
            onClick={() => onSelect(friend.user.id)}
            className={[
                'flex w-full cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors',
                active ? 'bg-primary-50' : 'bg-white hover:bg-slate-50',
            ].join(' ')}
        >
            <UserAvatar profile={friend} size="sm"/>
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                    <p className="m-0 truncate font-bold text-slate-900">{friend.user.username}</p>
                    {lastMessage && (
                        <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                            {previewTime(lastMessage.created_at)}
                        </span>
                    )}
                </div>
                <p className={`m-0 truncate text-sm ${unread ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                    {preview || 'No messages yet'}
                </p>
            </div>
            <UnreadBadge count={unread}/>
        </button>
    );
}

function MessageBubble({message, own}) {
    return (
        <div className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[78%] sm:max-w-[70%]">
                <div
                    className={[
                        'whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed',
                        own
                            ? 'rounded-br-md bg-primary-600 text-white'
                            : 'rounded-bl-md bg-slate-100 text-slate-800',
                    ].join(' ')}
                >
                    {message.content}
                </div>
                <p className={`m-0 mt-1 text-[11px] font-semibold text-slate-400 ${own ? 'text-right' : ''}`}>
                    {timeFormatter.format(new Date(message.created_at))}
                </p>
            </div>
        </div>
    );
}

function MessagesPage() {
    const {userId} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();

    const activeUserId = userId ? Number(userId) : null;

    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [thread, setThread] = useState(null);
    const [loadingThread, setLoadingThread] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const scrollRef = useRef(null);
    const stickToBottomRef = useRef(true);
    const anchorHeightRef = useRef(null);

    const messages = thread?.messages || [];
    const lastMessageId = messages.length ? messages[messages.length - 1].id : null;

    const loadConversations = useCallback(async () => {
        try {
            const {data} = await api.get('api/messages/conversations/');
            setConversations(data);
        } catch {
            // Keep whatever list is already on screen.
        } finally {
            setLoadingConversations(false);
        }
    }, []);

    useEffect(() => {
        loadConversations();
        const interval = setInterval(loadConversations, CONVERSATIONS_POLL_MS);
        return () => clearInterval(interval);
    }, [loadConversations]);

    // Full thread load whenever the selected friend changes.
    useEffect(() => {
        if (!activeUserId) {
            setThread(null);
            return undefined;
        }

        let active = true;
        setLoadingThread(true);
        setError('');
        setDraft('');
        stickToBottomRef.current = true;

        api.get(`api/messages/thread/${activeUserId}/`)
            .then(({data}) => {
                if (!active) return;
                setThread(data);
                // Opening a thread marks it read server-side; drop the badge now.
                notifyMessagesUpdated();
                loadConversations();
            })
            .catch((err) => {
                if (!active) return;
                setThread(null);
                setError(err.response?.data?.detail || 'Could not open this conversation.');
            })
            .finally(() => {
                if (active) setLoadingThread(false);
            });

        return () => {
            active = false;
        };
    }, [activeUserId, loadConversations]);

    // Poll for incoming messages while a thread is open.
    const threadReady = Boolean(thread);
    useEffect(() => {
        if (!activeUserId || !threadReady) return undefined;

        const poll = async () => {
            if (document.visibilityState === 'hidden') return;
            try {
                const url = lastMessageId
                    ? `api/messages/thread/${activeUserId}/?after=${lastMessageId}`
                    : `api/messages/thread/${activeUserId}/`;
                const {data} = await api.get(url);
                if (!data.messages.length) return;
                setThread((prev) => {
                    if (!prev) return prev;
                    const known = new Set(prev.messages.map((message) => message.id));
                    const incoming = data.messages.filter((message) => !known.has(message.id));
                    if (!incoming.length) return prev;
                    return {...prev, messages: [...prev.messages, ...incoming]};
                });
                notifyMessagesUpdated();
                loadConversations();
            } catch {
                // Transient failures just mean a slightly later delivery.
            }
        };

        const interval = setInterval(poll, THREAD_POLL_MS);
        return () => clearInterval(interval);
    }, [activeUserId, threadReady, lastMessageId, loadConversations]);

    // Follow new messages, but never yank the view while someone reads history.
    // Runs before paint so neither the jump to the bottom nor the anchor
    // restore after loading older messages is visible as a flash.
    useLayoutEffect(() => {
        const node = scrollRef.current;
        if (!node) return;
        if (anchorHeightRef.current !== null) {
            // Older messages were just prepended: keep the same message under
            // the reader's eyes by preserving the distance from the bottom.
            node.scrollTop = node.scrollHeight - anchorHeightRef.current;
            anchorHeightRef.current = null;
            return;
        }
        if (!stickToBottomRef.current) return;
        node.scrollTop = node.scrollHeight;
    }, [messages.length, loadingThread]);

    const handleScroll = () => {
        const node = scrollRef.current;
        if (!node) return;
        const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
        stickToBottomRef.current = distanceFromBottom < 80;
    };

    const loadOlder = async () => {
        if (!thread?.messages.length) return;
        setLoadingOlder(true);
        try {
            const {data} = await api.get(
                `api/messages/thread/${activeUserId}/?before=${thread.messages[0].id}`
            );
            if (!data.messages.length) {
                setThread((prev) => (prev ? {...prev, has_more: false} : prev));
                return;
            }
            // Hand the layout effect the pre-insert height so it can restore
            // the reading position once the new rows are in the DOM.
            stickToBottomRef.current = false;
            anchorHeightRef.current = scrollRef.current?.scrollHeight ?? 0;
            setThread((prev) => (prev ? {
                ...prev,
                messages: [...data.messages, ...prev.messages],
                has_more: data.has_more,
            } : prev));
        } catch {
            setError('Could not load earlier messages.');
        } finally {
            setLoadingOlder(false);
        }
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        const content = draft.trim();
        if (!content || sending || !thread?.is_friend) return;

        setSending(true);
        setError('');
        try {
            const {data} = await api.post('api/messages/send/', {
                to_user_id: activeUserId,
                content,
            });
            stickToBottomRef.current = true;
            setThread((prev) => (prev ? {...prev, messages: [...prev.messages, data]} : prev));
            setDraft('');
            loadConversations();
        } catch (err) {
            setError(err.response?.data?.detail || 'Message could not be sent.');
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage(event);
        }
    };

    const groupedMessages = useMemo(() => {
        const groups = [];
        messages.forEach((message) => {
            const date = new Date(message.created_at);
            const key = date.toDateString();
            const current = groups[groups.length - 1];
            if (!current || current.key !== key) {
                groups.push({key, label: dayLabel(date), messages: [message]});
            } else {
                current.messages.push(message);
            }
        });
        return groups;
    }, [messages]);

    const totalUnread = conversations.reduce((sum, entry) => sum + entry.unread_count, 0);
    const activeFriend = thread?.friend;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 sm:py-12">
            <PageContainer maxWidth="max-w-5xl">
                <div>
                    <p className="m-0 inline-flex items-center gap-2 text-sm font-bold text-primary-600">
                        <MessageCircle className="size-4"/> Friends only
                    </p>
                    <h1 className="m-0 mt-1 font-display text-3xl font-bold text-slate-900">Messages</h1>
                    <p className="m-0 mt-2 text-slate-600">
                        {totalUnread > 0
                            ? `${totalUnread} unread message${totalUnread === 1 ? '' : 's'}.`
                            : 'Plan a duel, compare answers, or ask a friend how they solved it.'}
                    </p>
                </div>

                <Card className="mt-6 overflow-hidden">
                    <div className="grid lg:grid-cols-[19rem_1fr]">
                        {/* Conversation list */}
                        <div
                            className={[
                                PANE_HEIGHT,
                                'flex-col border-slate-200 lg:flex lg:border-r',
                                activeUserId ? 'hidden' : 'flex',
                            ].join(' ')}
                        >
                            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                                <Users className="size-4 text-primary-600"/>
                                <h2 className="m-0 text-sm font-black uppercase tracking-wide text-slate-500">Friends</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {loadingConversations ? (
                                    <div className="grid h-full place-items-center"><Spinner/></div>
                                ) : conversations.length ? (
                                    conversations.map((entry) => (
                                        <ConversationRow
                                            key={entry.friend.user.id}
                                            entry={entry}
                                            active={entry.friend.user.id === activeUserId}
                                            onSelect={(id) => navigate(`/messages/${id}`)}
                                        />
                                    ))
                                ) : (
                                    <div className="px-5 py-10 text-center">
                                        <p className="m-0 font-bold text-slate-900">No friends yet</p>
                                        <p className="m-0 mt-1 text-sm text-slate-500">
                                            Add classmates from your profile to start a conversation.
                                        </p>
                                        <Button to="/profile" size="sm" variant="secondary" className="mt-4">
                                            <UserRound className="size-4"/> Find friends
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thread */}
                        <div
                            className={[
                                PANE_HEIGHT,
                                'flex-col lg:flex',
                                activeUserId ? 'flex' : 'hidden',
                            ].join(' ')}
                        >
                            {!activeUserId ? (
                                <div className="grid h-full place-items-center px-6 text-center">
                                    <div>
                                        <MessageCircle className="mx-auto size-8 text-slate-300"/>
                                        <p className="m-0 mt-3 font-bold text-slate-900">Pick a conversation</p>
                                        <p className="m-0 mt-1 text-sm text-slate-500">
                                            Choose a friend on the left to see your chat history.
                                        </p>
                                    </div>
                                </div>
                            ) : loadingThread ? (
                                <div className="grid h-full place-items-center"><Spinner/></div>
                            ) : !thread ? (
                                <div className="grid h-full place-items-center px-6 text-center">
                                    <div>
                                        <p className="m-0 font-bold text-slate-900">Conversation unavailable</p>
                                        <p className="m-0 mt-1 text-sm text-slate-500">{error || 'Try again in a moment.'}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/messages')}
                                            className="-ml-1 flex size-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
                                            aria-label="Back to conversations"
                                        >
                                            <ArrowLeft className="size-5"/>
                                        </button>
                                        <UserAvatar profile={activeFriend} size="sm"/>
                                        <div className="min-w-0 flex-1">
                                            <p className="m-0 truncate font-bold text-slate-900">
                                                {activeFriend?.user?.username}
                                            </p>
                                            <p className="m-0 text-xs font-semibold text-slate-400">
                                                {activeFriend?.elo_rating ?? '—'} Duel Elo
                                            </p>
                                        </div>
                                        <Link
                                            to={`/profile/${activeUserId}`}
                                            className="rounded-xl px-3 py-1.5 text-sm font-semibold text-primary-600 no-underline hover:bg-primary-50"
                                        >
                                            Profile
                                        </Link>
                                    </div>

                                    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                                        {thread.has_more && (
                                            <div className="text-center">
                                                <Button size="sm" variant="ghost" onClick={loadOlder} loading={loadingOlder}>
                                                    Load earlier messages
                                                </Button>
                                            </div>
                                        )}

                                        {!messages.length && (
                                            <div className="grid h-full place-items-center px-6 text-center">
                                                <div>
                                                    <p className="m-0 font-bold text-slate-900">
                                                        No messages with {activeFriend?.user?.username} yet
                                                    </p>
                                                    <p className="m-0 mt-1 text-sm text-slate-500">
                                                        Say hello, or challenge them to a duel.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {groupedMessages.map((group) => (
                                            <div key={group.key} className="space-y-3">
                                                <div className="flex justify-center">
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                                        {group.label}
                                                    </span>
                                                </div>
                                                {group.messages.map((message) => (
                                                    <MessageBubble
                                                        key={message.id}
                                                        message={message}
                                                        own={message.sender_id === user?.id}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 px-4 py-3">
                                        {error && <div className="mb-3"><Alert>{error}</Alert></div>}
                                        {thread.is_friend ? (
                                            <form onSubmit={sendMessage} className="flex items-end gap-2">
                                                <Textarea
                                                    value={draft}
                                                    onChange={(event) => setDraft(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                                                    onKeyDown={handleKeyDown}
                                                    rows={1}
                                                    placeholder={`Message ${activeFriend?.user?.username}…`}
                                                    className="max-h-32 min-h-[2.75rem] resize-none"
                                                    aria-label="Message"
                                                />
                                                <Button type="submit" loading={sending} disabled={!draft.trim()} className="shrink-0">
                                                    <Send className="size-4"/>
                                                    <span className="hidden sm:inline">Send</span>
                                                </Button>
                                            </form>
                                        ) : (
                                            <p className="m-0 text-center text-sm text-slate-500">
                                                You are no longer friends with {activeFriend?.user?.username}. Add them again to keep chatting.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Card>
            </PageContainer>
        </div>
    );
}

export default withAuth(MessagesPage);
