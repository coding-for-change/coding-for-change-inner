import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_config_color_mode" AS ENUM('auto', 'dark', 'light');
  ALTER TABLE "site_config" ADD COLUMN "color_mode" "enum_site_config_color_mode" DEFAULT 'auto' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config" DROP COLUMN "color_mode";
  DROP TYPE "public"."enum_site_config_color_mode";`)
}
