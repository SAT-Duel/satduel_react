import React, {useEffect, useRef, useState} from 'react';
import {ChevronDown, Highlighter, Trash2} from 'lucide-react';

const colors = [
    ['yellow', 'bg-yellow-200'],
    ['blue', 'bg-blue-200'],
    ['pink', 'bg-pink-200'],
];

const underlines = [
    ['solid', 'Solid'],
    ['dashed', 'Dashed'],
    ['dotted', 'Dotted'],
    ['none', 'None'],
];

export default function AnnotationToolbar({mark, rect, onChange, onDelete, onClose}) {
    const [underlineOpen, setUnderlineOpen] = useState(false);
    const toolbar = useRef(null);

    useEffect(() => {
        if (!mark) return undefined;
        const closeOutside = (event) => {
            if (!toolbar.current?.contains(event.target)) onClose();
        };
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('pointerdown', closeOutside, true);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOutside, true);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [mark, onClose]);

    if (!mark || !rect) return null;
    const narrow = window.innerWidth < 420;
    const left = Math.max(190, Math.min(window.innerWidth - 190, rect.left + rect.width / 2));
    const top = Math.max(12, rect.top - 78);

    return (
        <div
            ref={toolbar}
            className="fixed z-[90] flex items-center gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-2xl"
            style={narrow ? {left: 8, right: 8, top, justifyContent: 'center'} : {left, top, transform: 'translateX(-50%)'}}
            role="toolbar"
            aria-label="Highlight tools"
        >
            {colors.map(([color, className]) => (
                <button
                    key={color}
                    type="button"
                    aria-label={`${color} highlight`}
                    onClick={() => onChange({...mark, color})}
                    className={`flex size-10 cursor-pointer items-center justify-center rounded-full border-2 ${className} ${mark.color === color ? 'border-slate-800' : 'border-slate-400'}`}
                >
                    {color === 'yellow' && <Highlighter className="size-5 text-slate-800"/>}
                </button>
            ))}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setUnderlineOpen((open) => !open)}
                    className="flex h-10 cursor-pointer items-center gap-1 border-0 bg-transparent px-2 text-xl font-black text-slate-900"
                    aria-label="Underline style"
                    aria-expanded={underlineOpen}
                >
                    <span className="border-b-2 border-slate-900 leading-7">U</span><ChevronDown className="size-4"/>
                </button>
                {underlineOpen && (
                    <div className="absolute left-1/2 top-12 w-32 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                        {underlines.map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => {
                                    onChange({...mark, underline: value});
                                    setUnderlineOpen(false);
                                }}
                                className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-100"
                            >
                                {label}
                                {value !== 'none' && <span className="w-8 border-b-2 border-slate-800" style={{borderBottomStyle: value}}/>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <span className="h-8 w-px bg-slate-200"/>
            <button type="button" onClick={onDelete} className="flex size-10 cursor-pointer items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Delete highlight">
                <Trash2 className="size-5"/>
            </button>
        </div>
    );
}
