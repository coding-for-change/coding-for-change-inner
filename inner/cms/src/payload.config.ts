import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { mcpPlugin } from '@payloadcms/plugin-mcp';
import { resendAdapter } from '@payloadcms/email-resend';
import { Team } from './collections/Team';
import { Projects } from './collections/Projects';
import { Events } from './collections/Events';
import { FAQ } from './collections/FAQ';
import { Sponsors } from './collections/Sponsors';
import { Companies } from './collections/Companies';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { BlogPost } from './collections/BlogPost';
import { WaitlistSignups } from './collections/WaitlistSignups';
import { SiteConfig } from './globals/SiteConfig';
import { Membership } from './globals/Membership';
import { Legal } from './globals/Legal';

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Team, Projects, Events, FAQ, Sponsors, Companies, Media, BlogPost, WaitlistSignups],
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
  // Resend transactional email. Only wired up when a key is present, so local
  // dev still boots without one (Payload logs emails to the console instead).
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress:
          process.env.EMAIL_FROM || 'noreply@codingforchange.com',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Coding for Change',
      })
    : undefined,
  plugins: [
    // Contact (and any future) forms are defined in the admin panel and stored
    // in the `forms` / `form-submissions` collections. The inner site fetches
    // the schema and POSTs submissions to /api/form-submissions.
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        email: true,
        number: true,
        select: true,
        checkbox: true,
        message: true,
        // Not needed for our forms — keep the builder UI focused.
        country: false,
        state: false,
        date: false,
        payment: false,
      },
      // Fallback recipient when a form doesn't define its own emails.
      defaultToEmail:
        process.env.CONTACT_TO_EMAIL || 'info@codingforchange.com',
    }),
    // Model Context Protocol server at /api/mcp. Full CRUD on content is exposed
    // here, but every request still needs a Bearer API key (managed in the
    // admin "MCP API Keys" collection) whose per-capability access can be
    // narrowed there. Declared after formBuilderPlugin so it can see the
    // forms / form-submissions collections.
    mcpPlugin({
      collections: {
        team: { enabled: true },
        projects: { enabled: true },
        events: { enabled: true },
        faq: { enabled: true },
        sponsors: { enabled: true },
        companies: { enabled: true },
        media: { enabled: true },
        'blog-posts': { enabled: true },
        forms: { enabled: true },
        'form-submissions': { enabled: true },
      },
      globals: {
        'site-config': { enabled: true },
        membership: { enabled: true },
        legal: { enabled: true },
      },
    }),
  ],
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
