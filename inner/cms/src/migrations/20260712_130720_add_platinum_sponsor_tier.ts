import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_sponsors_tier" ADD VALUE 'platinum' BEFORE 'gold';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sponsors" ALTER COLUMN "tier" SET DATA TYPE text;
  DROP TYPE "public"."enum_sponsors_tier";
  CREATE TYPE "public"."enum_sponsors_tier" AS ENUM('gold', 'silver', 'bronze', 'partner');
  ALTER TABLE "sponsors" ALTER COLUMN "tier" SET DATA TYPE "public"."enum_sponsors_tier" USING "tier"::"public"."enum_sponsors_tier";`)
}
