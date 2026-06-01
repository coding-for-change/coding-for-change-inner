import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Team } from './collections/Team';
import { Projects } from './collections/Projects';
import { Events } from './collections/Events';
import { FAQ } from './collections/FAQ';
import { Sponsors } from './collections/Sponsors';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { BlogPost } from './collections/BlogPost';
import { SiteConfig } from './globals/SiteConfig';
import { Membership } from './globals/Membership';
import { Legal } from './globals/Legal';

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Team, Projects, Events, FAQ, Sponsors, Media, BlogPost],
  globals: [SiteConfig, Membership, Legal],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Deutsch', code: 'de' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME',
  db: postgresAdapter({
    // push:true is Drizzle's schema-push — dev convenience only.
    // In production NODE_ENV is 'production' (set by next build), so this is false
    // and the Dockerfile runs `payload migrate` instead before starting.
    push: process.env.NODE_ENV !== 'production',
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
