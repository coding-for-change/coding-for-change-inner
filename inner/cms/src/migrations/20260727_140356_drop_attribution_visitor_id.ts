import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "waitlist_signups_attribution_attribution_visitor_id_idx";
  DROP INDEX "analytics_events_attribution_attribution_visitor_id_idx";
  DROP INDEX "form_submissions_attribution_attribution_visitor_id_idx";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_visitor_id";
  ALTER TABLE "analytics_events" DROP COLUMN "attribution_visitor_id";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_visitor_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_visitor_id" varchar;
  ALTER TABLE "analytics_events" ADD COLUMN "attribution_visitor_id" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_visitor_id" varchar;
  CREATE INDEX "waitlist_signups_attribution_attribution_visitor_id_idx" ON "waitlist_signups" USING btree ("attribution_visitor_id");
  CREATE INDEX "analytics_events_attribution_attribution_visitor_id_idx" ON "analytics_events" USING btree ("attribution_visitor_id");
  CREATE INDEX "form_submissions_attribution_attribution_visitor_id_idx" ON "form_submissions" USING btree ("attribution_visitor_id");`)
}
