import React from 'react';

export const DISCORD_INVITE = 'https://discord.gg/jzZTy3cdwm';
const DISCORD_BLURPLE = '#5865F2';

export function DiscordIcon({className = 'size-5'}) {
    // Official Discord mark (single-path, currentColor).
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.074.074 0 0 0-.079.037c-.34.607-.719 1.4-.984 2.023a18.28 18.28 0 0 0-5.487 0 12.6 12.6 0 0 0-.997-2.023.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.369a.07.07 0 0 0-.032.028C1.226 8.02.56 11.58.887 15.096a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-4.065-.838-7.596-2.744-10.7a.06.06 0 0 0-.031-.028zM8.02 12.955c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z"/>
        </svg>
    );
}

/**
 * Discord community CTA. `variant`:
 *  - 'button'  : compact blurple button (footer, inline)
 *  - 'banner'  : full-width card callout (login/register)
 */
export function DiscordCTA({variant = 'button', className = ''}) {
    if (variant === 'banner') {
        return (
            <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 rounded-2xl border border-[#5865F2]/20 bg-[#5865F2]/5 px-4 py-3 no-underline transition-colors hover:bg-[#5865F2]/10 ${className}`}
            >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor: DISCORD_BLURPLE}}>
                    <DiscordIcon className="size-5"/>
                </span>
                <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900">Join our Discord</span>
                    <span className="block text-xs text-slate-500">Study with others, get help, find duel partners.</span>
                </span>
            </a>
        );
    }

    return (
        <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-2 text-[15px] font-semibold text-white no-underline transition-all active:translate-y-[3px] active:shadow-none ${className}`}
            style={{backgroundColor: DISCORD_BLURPLE, borderColor: '#4752c4', boxShadow: '0 4px 0 0 #4752c4'}}
        >
            <DiscordIcon className="size-5"/> Join our Discord
        </a>
    );
}

export default DiscordCTA;
