import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_analytics_events_type" ADD VALUE 'booking_completed';
  CREATE TABLE "consent_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"consent_id" varchar NOT NULL,
  	"statistics" boolean,
  	"marketing" boolean,
  	"config_version" numeric,
  	"locale" varchar,
  	"path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "waitlist_signups" ADD COLUMN "attribution_visitor_id" varchar;
  ALTER TABLE "analytics_events" ADD COLUMN "attribution_visitor_id" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "attribution_visitor_id" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consent_records_id" integer;
  CREATE INDEX "consent_records_consent_id_idx" ON "consent_records" USING btree ("consent_id");
  CREATE INDEX "consent_records_statistics_idx" ON "consent_records" USING btree ("statistics");
  CREATE INDEX "consent_records_marketing_idx" ON "consent_records" USING btree ("marketing");
  CREATE INDEX "consent_records_updated_at_idx" ON "consent_records" USING btree ("updated_at");
  CREATE INDEX "consent_records_created_at_idx" ON "consent_records" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consent_records_fk" FOREIGN KEY ("consent_records_id") REFERENCES "public"."consent_records"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "waitlist_signups_attribution_attribution_visitor_id_idx" ON "waitlist_signups" USING btree ("attribution_visitor_id");
  CREATE INDEX "analytics_events_attribution_attribution_visitor_id_idx" ON "analytics_events" USING btree ("attribution_visitor_id");
  CREATE INDEX "form_submissions_attribution_attribution_visitor_id_idx" ON "form_submissions" USING btree ("attribution_visitor_id");
  CREATE INDEX "payload_locked_documents_rels_consent_records_id_idx" ON "payload_locked_documents_rels" USING btree ("consent_records_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "consent_records" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "consent_records" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consent_records_fk";
  
  ALTER TABLE "analytics_events" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_analytics_events_type";
  CREATE TYPE "public"."enum_analytics_events_type" AS ENUM('landing', 'pageview', 'cta_click', 'form_start', 'conversion', 'outbound_click', 'booking_started');
  ALTER TABLE "analytics_events" ALTER COLUMN "type" SET DATA TYPE "public"."enum_analytics_events_type" USING "type"::"public"."enum_analytics_events_type";
  DROP INDEX "waitlist_signups_attribution_attribution_visitor_id_idx";
  DROP INDEX "analytics_events_attribution_attribution_visitor_id_idx";
  DROP INDEX "form_submissions_attribution_attribution_visitor_id_idx";
  DROP INDEX "payload_locked_documents_rels_consent_records_id_idx";
  ALTER TABLE "waitlist_signups" DROP COLUMN "attribution_visitor_id";
  ALTER TABLE "analytics_events" DROP COLUMN "attribution_visitor_id";
  ALTER TABLE "form_submissions" DROP COLUMN "attribution_visitor_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consent_records_id";`)
}
