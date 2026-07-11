import React, {useEffect, useState} from 'react';

function remainingTime(target, now) {
    const minutes = Math.max(0, Math.ceil((new Date(target).getTime() - now) / 60000));
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return `${hours}h${rest ? ` ${rest}m` : ''}`;
}

export default function ResetCountdown({target, label = 'Resets', className = ''}) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!target) return undefined;
        const id = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(id);
    }, [target]);

    if (!target) return null;
    const resetTime = new Date(target).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});

    return (
        <span className={className} title={`${label} at ${new Date(target).toLocaleString()}`}>
            {label} in {remainingTime(target, now)} · {resetTime}
        </span>
    );
}
