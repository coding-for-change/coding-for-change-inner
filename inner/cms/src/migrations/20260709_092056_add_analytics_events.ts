import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_waitlist_signups_attribution_channel" AS ENUM('campaign', 'organic_search', 'social', 'referral', 'direct');
  CREATE TYPE "public"."enum_analytics_events_type" AS ENUM('landing', 'pageview', 'cta_click', 'form_start', 'conversion', 'outbound_click', 'booking_started');
  CREATE TYPE "public"."enum_analytics_events_attribution_channel" AS ENUM('campaign', 'organic_search', 'social', 'referral', 'direct');
  CREATE TYPE "public"."enum_form_submissions_attribution_channel" AS ENUM('campaign', 'organic_search', 'social', 'referral', 'direct');
  CREATE TABLE "analytics_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_analytics_events_type" NOT NULL,
  	"path" varchar,
  	"label" varchar,
  	"locale" varchar,
  	"attribution_source" varchar,
  	"attribution_channel" "enum_analytics_events_attribution_channel",
  	"attribution_medium" varchar,
  	"attribution_campaign" varchar,
  	"attribution_content" varchar,
  	"attribution_referrer" varchar,
  	"attribution_landing_path" varchar,
  	"attribution_session_id" varchar,
  	"attribution_first_seen_at" timestamp(3) with time zone,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_channel" "enum_waitlist_signups_attribution_channel";
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_channel" "enum_form_submissions_attribution_channel";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "analytics_events_id" integer;
  CREATE INDEX "analytics_events_type_idx" ON "analytics_events" USING btree ("type");
  CREATE INDEX "analytics_events_attribution_attribution_source_idx" ON "analytics_events" USING btree ("attribution_source");
  CREATE INDEX "analytics_events_attribution_attribution_channel_idx" ON "analytics_events" USING btree ("attribution_channel");
  CREATE INDEX "analytics_events_attribution_attribution_session_id_idx" ON "analytics_events" USING btree ("attribution_session_id");
  CREATE INDEX "analytics_events_updated_at_idx" ON "analytics_events" USING btree ("updated_at");
  CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_events_fk" FOREIGN KEY ("analytics_events_id") REFERENCES "public"."analytics_events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "waitlist_signups_attribution_attribution_channel_idx" ON "waitlist_signups" USING btree ("attribution_channel");
  CREATE INDEX "form_submissions_attribution_attribution_channel_idx" ON "form_submissions" USING btree ("attribution_channel");
  CREATE INDEX "payload_locked_documents_rels_analytics_events_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "analytics_events" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "analytics_events" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_analytics_events_fk";
  
  DROP INDEX "waitlist_signups_attribution_attribution_channel_idx";
  DROP INDEX "form_submissions_attribution_attribution_channel_idx";
  DROP INDEX "payload_locked_documents_rels_analytics_events_id_idx";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_channel";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_channel";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "analytics_events_id";
  DROP TYPE "public"."enum_waitlist_signups_attribution_channel";
  DROP TYPE "public"."enum_analytics_events_type";
  DROP TYPE "public"."enum_analytics_events_attribution_channel";
  DROP TYPE "public"."enum_form_submissions_attribution_channel";`)
}
