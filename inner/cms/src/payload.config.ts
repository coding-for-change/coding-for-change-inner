import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { searchPlugin } from '@payloadcms/plugin-search';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { mcpPlugin } from '@payloadcms/plugin-mcp';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { Team } from './collections/Team';
import { Projects } from './collections/Projects';
import { Events } from './collections/Events';
import { FAQ } from './collections/FAQ';
import { Sponsors } from './collections/Sponsors';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { SiteConfig } from './globals/SiteConfig';
import { Membership } from './globals/Membership';

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Team, Projects, Events, FAQ, Sponsors, Media],
  globals: [SiteConfig, Membership],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Deutsch', code: 'de' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    searchPlugin({
      collections: ['team', 'projects', 'events', 'faq', 'sponsors'],
      defaultPriorities: {
        events: 10,
        projects: 8,
        team: 7,
        faq: 5,
        sponsors: 3,
      },
    }),
    seoPlugin({
      collections: ['events', 'projects', 'team'],
      globals: ['site-config'],
      generateTitle: ({ doc }: { doc: Record<string, unknown> }) =>
        `${(doc?.title ?? doc?.name ?? '') as string} — Coding for Change`,
      generateDescription: ({ doc }: { doc: Record<string, unknown> }) =>
        ((doc?.description ?? doc?.bio ?? '') as string),
    }),
    mcpPlugin({
      collections: ['team', 'projects', 'events', 'faq', 'sponsors', 'media'],
      globals: ['site-config', 'membership'],
    }),
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        email: true,
        select: true,
        checkbox: true,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME',
  db: postgresAdapter({
    push: true,
    pool: {
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://payload:payload@localhost:5432/payload',
    },
  }),
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Coding for Change CMS',
    },
  },
  typescript: {
    outputFile: './src/payload-types.ts',
  },
});
