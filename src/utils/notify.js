const listeners = new Set();

function emit(type, text) {
    const toast = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        text: String(text || ''),
    };
    listeners.forEach((listener) => listener(toast));
}

export function subscribeToNotifications(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export const notify = {
    success: (text) => emit('success', text),
    error: (text) => emit('error', text),
    warning: (text) => emit('warning', text),
    info: (text) => emit('info', text),
};

export default notify;
