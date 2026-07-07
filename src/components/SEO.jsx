import React from 'react';
import {Helmet} from 'react-helmet';

export const SITE_URL = 'https://satduel.com';
export const SITE_NAME = 'SAT Duel';
export const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;

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
        sameAs: ['https://discord.gg/jzZTy3cdwm'],
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

export default function SEO({
    title,
    description,
    path = '/',
    image = DEFAULT_IMAGE,
    type = 'website',
    structuredData = [],
    noindex = false,
}) {
    const canonical = absoluteUrl(path);
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const imageUrl = absoluteUrl(image);

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description}/>
            <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'}/>
            <link rel="canonical" href={canonical}/>

            <meta property="og:site_name" content={SITE_NAME}/>
            <meta property="og:type" content={type}/>
            <meta property="og:title" content={fullTitle}/>
            <meta property="og:description" content={description}/>
            <meta property="og:url" content={canonical}/>
            <meta property="og:image" content={imageUrl}/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={fullTitle}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={imageUrl}/>

            {structuredData.map((item, index) => (
                <script key={`${item['@type'] || 'jsonld'}-${index}`} type="application/ld+json">
                    {JSON.stringify(item)}
                </script>
            ))}
        </Helmet>
    );
}
