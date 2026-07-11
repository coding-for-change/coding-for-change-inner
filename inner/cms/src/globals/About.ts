import { GlobalConfig } from 'payload';

// The About / entity page. Its job is twofold: tell a human who we are, and
// give search engines + LLMs one canonical, structured source of truth about
// the organization. All display copy lives here so editors can change the page
// without a deploy; the stable entity facts (founders, founding date, socials)
// live in the Organization JSON-LD in inner/src/app/layout.tsx. Impact numbers
// are reused from SiteConfig.stats; projects from the Projects collection; the
// identity FAQ from the FAQ collection (category "about").
export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page',
  access: {
    read: () => true,
  },
  fields: [
    // ---- Hero ----
    { name: 'kicker', type: 'text', localized: true },
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'definition',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description:
          'The answer-first, one-sentence definition of the organization. Shown large at the top of the page — and the primary text AI engines extract when asked "what is Coding for Change?". Keep it factual: what we are, where, and what we do.',
      },
    },
    { name: 'tagline', type: 'text', localized: true },

    // ---- Fact box (structured identity facts) ----
    {
      name: 'facts',
      label: 'Fact box',
      type: 'array',
      admin: {
        description:
          'Structured identity facts shown as a table (legal name, status, founded, location, …).',
        initCollapsed: true,
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },

    // ---- How it works ----
    { name: 'howTitle', type: 'text', localized: true },
    { name: 'howIntro', type: 'textarea', localized: true },
    {
      name: 'steps',
      label: 'How it works — steps',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },

    // ---- The people (links to the Team page) ----
    { name: 'peopleTitle', type: 'text', localized: true },
    { name: 'peopleBody', type: 'richText', localized: true },

    // ---- Our work (project cards come from the Projects collection) ----
    { name: 'workTitle', type: 'text', localized: true },
    { name: 'workIntro', type: 'textarea', localized: true },

    // ---- How we're funded ----
    { name: 'fundingTitle', type: 'text', localized: true },
    { name: 'fundingBody', type: 'richText', localized: true },

    // ---- In the media ----
    { name: 'mediaTitle', type: 'text', localized: true },
    {
      name: 'media',
      label: 'In the media',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        // Outlet + url are proper nouns / links, so locale-agnostic.
        { name: 'outlet', type: 'text', required: true },
        { name: 'description', type: 'text', localized: true },
        { name: 'url', type: 'text' },
      ],
    },

    // ---- FAQ (items come from the FAQ collection, category "about") ----
    { name: 'faqTitle', type: 'text', localized: true },
    { name: 'faqIntro', type: 'textarea', localized: true },

    // ---- Get involved (the three "doors") ----
    { name: 'ctaTitle', type: 'text', localized: true },
    {
      name: 'doors',
      label: 'Get-involved cards',
      type: 'array',
      admin: {
        description:
          'The three audiences: nonprofits, students, companies. Each links to a page (ctaHref, e.g. /contact or /join).',
        initCollapsed: true,
      },
      fields: [
        { name: 'audience', type: 'text', required: true, localized: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
        { name: 'ctaLabel', type: 'text', required: true, localized: true },
        { name: 'ctaHref', type: 'text', required: true },
      ],
    },
  ],
};
