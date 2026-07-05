import React from 'react';
import {User} from 'lucide-react';
import {getAvatarBackground, getPixelAvatar} from './avatarCatalog';

const SIZE_CLASSES = {
    xs: 'size-8 text-xs',
    sm: 'size-10 text-base',
    md: 'size-14 text-xl',
    lg: 'size-28 text-4xl',
    xl: 'size-32 text-5xl',
};

const IMAGE_SCALE = {
    xs: 'scale-[1.28]',
    sm: 'scale-[1.24]',
    md: 'scale-[1.2]',
    lg: 'scale-[1.16]',
    xl: 'scale-[1.14]',
};

function getInitial(profile) {
    return profile?.user?.username?.[0]?.toUpperCase()
        || profile?.username?.[0]?.toUpperCase()
        || '?';
}

export default function UserAvatar({
    profile,
    backgroundId,
    iconId,
    size = 'lg',
    rounded = 'full',
    className = '',
    imageClassName = '',
}) {
    const background = getAvatarBackground(backgroundId || profile?.avatar);
    const pixelAvatar = getPixelAvatar(iconId || profile?.avatar_icon || 'initial');
    const radiusClass = rounded === 'xl' ? 'rounded-2xl' : 'rounded-full';

    return (
        <div
            className={[
                'relative flex shrink-0 items-center justify-center overflow-hidden font-display font-bold',
                'ring-4 ring-white',
                radiusClass,
                SIZE_CLASSES[size] || SIZE_CLASSES.lg,
                background.classes,
                className,
            ].join(' ')}
        >
            {pixelAvatar.image ? (
                <img
                    src={pixelAvatar.image}
                    alt={pixelAvatar.label}
                    className={[
                        'h-full w-full object-contain image-render-pixel',
                        IMAGE_SCALE[size] || IMAGE_SCALE.lg,
                        imageClassName,
                    ].join(' ')}
                    draggable="false"
                />
            ) : (
                <span className="relative z-10 leading-none">
                    {getInitial(profile) || <User className="size-4"/>}
                </span>
            )}
        </div>
    );
}
