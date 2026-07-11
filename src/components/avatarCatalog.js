import novaQuill from '../assets/avatars/pixel/nova-quill.png';
import emberAbacus from '../assets/avatars/pixel/ember-abacus.png';
import cipherLantern from '../assets/avatars/pixel/cipher-lantern.png';
import prismPage from '../assets/avatars/pixel/prism-page.png';
import orbitScout from '../assets/avatars/pixel/orbit-scout.png';
import inkcapAlchemist from '../assets/avatars/pixel/inkcap-alchemist.png';
import bloomCircuit from '../assets/avatars/pixel/bloom-circuit.png';
import echoFencer from '../assets/avatars/pixel/echo-fencer.png';
import slateSentinel from '../assets/avatars/pixel/slate-sentinel.png';
import miraMnemonic from '../assets/avatars/pixel/mira-mnemonic.png';
import pixelPathfinder from '../assets/avatars/pixel/pixel-pathfinder.png';
import marginWarden from '../assets/avatars/pixel/margin-warden.png';

export const AVATAR_BACKGROUNDS = [
    {id: 'violet', label: 'Violet', classes: 'bg-primary-600 text-white'},
    {id: 'sky', label: 'Sky', classes: 'bg-sky-500 text-white'},
    {id: 'emerald', label: 'Emerald', classes: 'bg-emerald-500 text-white'},
    {id: 'amber', label: 'Amber', classes: 'bg-amber-400 text-slate-900'},
    {id: 'rose', label: 'Rose', classes: 'bg-rose-500 text-white'},
    {id: 'slate', label: 'Slate', classes: 'bg-slate-800 text-white'},
];

export const PIXEL_AVATARS = [
    {
        id: 'initial',
        label: 'Initial',
        tagline: 'Classic letter mark',
        image: null,
    },
    {
        id: 'nova-quill',
        label: 'Nova Quill',
        tagline: 'Star-map traveler',
        image: novaQuill,
    },
    {
        id: 'ember-abacus',
        label: 'Ember Abacus',
        tagline: 'Math-smith',
        image: emberAbacus,
    },
    {
        id: 'cipher-lantern',
        label: 'Cipher Lantern',
        tagline: 'Puzzle scout',
        image: cipherLantern,
    },
    {
        id: 'prism-page',
        label: 'Prism Page',
        tagline: 'Shield-scholar',
        image: prismPage,
    },
    {
        id: 'orbit-scout',
        label: 'Orbit Scout',
        tagline: 'Sky navigator',
        image: orbitScout,
    },
    {
        id: 'inkcap-alchemist',
        label: 'Inkcap Alchemist',
        tagline: 'Midnight ink mage',
        image: inkcapAlchemist,
    },
    {
        id: 'bloom-circuit',
        label: 'Bloom Circuit',
        tagline: 'Techno-botanist',
        image: bloomCircuit,
    },
    {
        id: 'echo-fencer',
        label: 'Echo Fencer',
        tagline: 'Debate duelist',
        image: echoFencer,
    },
    {
        id: 'slate-sentinel',
        label: 'Slate Sentinel',
        tagline: 'Library guardian',
        image: slateSentinel,
    },
    {
        id: 'mira-mnemonic',
        label: 'Mira Mnemonic',
        tagline: 'Memory bard',
        image: miraMnemonic,
    },
    {
        id: 'pixel-pathfinder',
        label: 'Pixel Pathfinder',
        tagline: 'Retro mapmaker',
        image: pixelPathfinder,
    },
    {
        id: 'margin-warden',
        label: 'Margin Warden',
        tagline: 'Final-boss scholar',
        image: marginWarden,
    },
];

export function getAvatarBackground(id) {
    return AVATAR_BACKGROUNDS.find((background) => background.id === id) || AVATAR_BACKGROUNDS[0];
}

export function getPixelAvatar(id) {
    return PIXEL_AVATARS.find((avatar) => avatar.id === id) || PIXEL_AVATARS[0];
}
