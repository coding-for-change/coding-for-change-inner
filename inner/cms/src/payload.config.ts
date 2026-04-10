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
import { SiteConfig } from './globals/SiteConfig';
import { Membership } from './globals/Membership';

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Team, Projects, Events, FAQ, Sponsors, Media],
  globals: [SiteConfig, Membership],
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
