import About from '@/components/showcase/About';
import { fetchGlobal, fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsAbout, CmsFaqItem, CmsSiteConfig, CmsProject } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'About — Coding for Change',
    description:
        'Coding for Change is a gemeinnütziger student initiative in Munich, founded by students from TUM and LMU, building free custom software for nonprofit organizations.',
};

export default async function AboutPage() {
    const locale = await getServerLocale();
    // Everything the page shows is CMS-driven: the editorial copy from the
    // `about` global, impact numbers reused from site-config, project cards from
    // the Projects collection, and the identity FAQ from the FAQ collection
    // (category "about"). All fetched in parallel; each degrades to null/[].
    const [about, faqs, siteConfig, projects] = await Promise.all([
        fetchGlobal<CmsAbout>('about', locale),
        fetchCollection<CmsFaqItem>('faq', locale, {
            'where[category][equals]': 'about',
            sort: '_order',
        }),
        fetchGlobal<CmsSiteConfig>('site-config', locale),
        fetchCollection<CmsProject>('projects', locale, { sort: '_order' }),
    ]);

    // FAQPage structured data, emitted from the About-category FAQ so the
    // identity Q&A is eligible for AI citation and rich results. Rendered inline
    // (server component) — Google reads JSON-LD anywhere in the document.
    const faqJsonLd =
        faqs.length > 0
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqs.map((f) => ({
                      '@type': 'Question',
                      name: f.question,
                      acceptedAnswer: { '@type': 'Answer', text: f.answer },
                  })),
              }
            : null;

    return (
        <>
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <About
                about={about}
                faqs={faqs}
                stats={siteConfig?.stats ?? []}
                projects={projects}
            />
        </>
    );
}
