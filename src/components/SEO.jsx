import React from 'react';
import {Helmet} from 'react-helmet-async';
import {DISCORD_INVITE} from './Discord';
import {DEFAULT_IMAGE as DEFAULT_IMAGE_PATH, SITE_NAME, SITE_URL, seoMeta} from '../seo/routes';

export {SITE_NAME, SITE_URL, seoMeta};

// A 1200x630 social card, not the square logo — crawlers crop/letterbox a
// square badly and it reads as "no preview". Source: docs/og-image.html.
export const DEFAULT_IMAGE = `${SITE_URL}${DEFAULT_IMAGE_PATH}`;

export function absoluteUrl(path = '/') {
    if (!path) return SITE_URL;
    if (path.startsWith('http')) return path;
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function organizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: DEFAULT_IMAGE,
        email: 'satduel@gmail.com',
        sameAs: [DISCORD_INVITE],
    };
}

export function websiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: 'Digital SAT practice with adaptive questions, rating-based progress, and study duels.',
    };
}

export function softwareAppJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: SITE_URL,
        image: DEFAULT_IMAGE,
        description: 'A Digital SAT study platform for adaptive practice, quick diagnostics, and competitive study duels.',
        offers: [
            {
                '@type': 'Offer',
                name: 'SAT Duel Free',
                price: '0',
                priceCurrency: 'USD',
            },
            {
                '@type': 'Offer',
                name: 'SAT Duel Premium',
                price: '9.99',
                priceCurrency: 'USD',
            },
        ],
    };
}

export function breadcrumbJsonLd(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

export function faqJsonLd(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
}

export function articleJsonLd({title, description, path}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url: absoluteUrl(path),
        author: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
                '@type': 'ImageObject',
                url: DEFAULT_IMAGE,
            },
        },
    };
}

/**
 * Public pages should pass `seoKey` so their title, description, path and OG
 * card come from src/seo/routes.js — the same source scripts/prerender.mjs
 * uses, which is what keeps the tags a crawler sees identical to the ones
 * react-helmet-async writes. Private pages pass explicit props plus `noindex`.
 */
export default function SEO({
    seoKey,
    title,
    description,
    path = '/',
    image,
    type = 'website',
    structuredData = [],
    noindex = false,
}) {
    const meta = seoKey ? seoMeta(seoKey) : null;
    const resolved = {
        title: title ?? meta?.title,
        description: description ?? meta?.description,
        path: meta?.path ?? path,
        image: image ?? meta?.image ?? DEFAULT_IMAGE,
        type: meta?.type ?? type,
    };

    const canonical = absoluteUrl(resolved.path);
    const fullTitle = resolved.title.includes(SITE_NAME)
        ? resolved.title
        : `${resolved.title} | ${SITE_NAME}`;
    const imageUrl = absoluteUrl(resolved.image);

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={resolved.description}/>
            <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'}/>
            <link rel="canonical" href={canonical}/>

            <meta property="og:site_name" content={SITE_NAME}/>
            <meta property="og:type" content={resolved.type}/>
            <meta property="og:title" content={fullTitle}/>
            <meta property="og:description" content={resolved.description}/>
            <meta property="og:url" content={canonical}/>
            <meta property="og:image" content={imageUrl}/>
            <meta property="og:image:width" content="1200"/>
            <meta property="og:image:height" content="630"/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={fullTitle}/>
            <meta name="twitter:description" content={resolved.description}/>
            <meta name="twitter:image" content={imageUrl}/>

            {structuredData.map((item, index) => (
                <script key={`${item['@type'] || 'jsonld'}-${index}`} type="application/ld+json">
                    {JSON.stringify(item)}
                </script>
            ))}
        </Helmet>
    );
}
