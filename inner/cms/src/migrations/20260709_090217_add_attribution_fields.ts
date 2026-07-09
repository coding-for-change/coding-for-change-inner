import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_source" varchar;
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_medium" varchar;
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_campaign" varchar;
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_content" varchar;
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_referrer" varchar;
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_landing_path" varchar;
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_session_id" varchar;
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_first_seen_at" timestamp(3) with time zone;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_source" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_medium" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_campaign" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_content" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_referrer" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_landing_path" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_session_id" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_first_seen_at" timestamp(3) with time zone;
  CREATE INDEX "waitlist_signups_attribution_attribution_source_idx" ON "waitlist_signups" USING btree ("attribution_source");
  CREATE INDEX "waitlist_signups_attribution_attribution_session_id_idx" ON "waitlist_signups" USING btree ("attribution_session_id");
  CREATE INDEX "form_submissions_attribution_attribution_source_idx" ON "form_submissions" USING btree ("attribution_source");
  CREATE INDEX "form_submissions_attribution_attribution_session_id_idx" ON "form_submissions" USING btree ("attribution_session_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "waitlist_signups_attribution_attribution_source_idx";
  DROP INDEX "waitlist_signups_attribution_attribution_session_id_idx";
  DROP INDEX "form_submissions_attribution_attribution_source_idx";
  DROP INDEX "form_submissions_attribution_attribution_session_id_idx";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_source";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_medium";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_campaign";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_content";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_referrer";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_landing_path";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_session_id";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_first_seen_at";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_source";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_medium";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_campaign";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_content";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_referrer";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_landing_path";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_session_id";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_first_seen_at";`)
}
