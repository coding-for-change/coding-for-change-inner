import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config" ADD COLUMN "member_count" varchar;`)

  // Seed the club's current headcount so the figure is on the page the moment
  // this deploys. It is an initial value, not a fixed one — editing "Member
  // count" in the admin overwrites it, and this only ever fills a NULL, so a
  // re-run can't clobber whatever an editor has since typed.
  await db.execute(sql`
   UPDATE "site_config" SET "member_count" = '20' WHERE "member_count" IS NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config" DROP COLUMN "member_count";`)
}
