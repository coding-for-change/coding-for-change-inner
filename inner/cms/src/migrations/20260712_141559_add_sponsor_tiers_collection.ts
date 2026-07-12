import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "sponsor_tiers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sponsor_tiers_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "sponsors" ALTER COLUMN "tier" DROP NOT NULL;
  ALTER TABLE "sponsors" ADD COLUMN "tier_ref_id" integer;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "sponsor_tiers_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "sponsor_tiers_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "sponsor_tiers_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "sponsor_tiers_delete" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sponsor_tiers_id" integer;
  ALTER TABLE "sponsor_tiers_locales" ADD CONSTRAINT "sponsor_tiers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sponsor_tiers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sponsor_tiers_updated_at_idx" ON "sponsor_tiers" USING btree ("updated_at");
  CREATE INDEX "sponsor_tiers_created_at_idx" ON "sponsor_tiers" USING btree ("created_at");
  CREATE UNIQUE INDEX "sponsor_tiers_locales_locale_parent_id_unique" ON "sponsor_tiers_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_tier_ref_id_sponsor_tiers_id_fk" FOREIGN KEY ("tier_ref_id") REFERENCES "public"."sponsor_tiers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsor_tiers_fk" FOREIGN KEY ("sponsor_tiers_id") REFERENCES "public"."sponsor_tiers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sponsors_tier_ref_idx" ON "sponsors" USING btree ("tier_ref_id");
  CREATE INDEX "payload_locked_documents_rels_sponsor_tiers_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsor_tiers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sponsor_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sponsor_tiers_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sponsor_tiers" CASCADE;
  DROP TABLE "sponsor_tiers_locales" CASCADE;
  ALTER TABLE "sponsors" DROP CONSTRAINT "sponsors_tier_ref_id_sponsor_tiers_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sponsor_tiers_fk";
  
  DROP INDEX "sponsors_tier_ref_idx";
  DROP INDEX "payload_locked_documents_rels_sponsor_tiers_id_idx";
  ALTER TABLE "sponsors" ALTER COLUMN "tier" SET NOT NULL;
  ALTER TABLE "sponsors" DROP COLUMN "tier_ref_id";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "sponsor_tiers_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "sponsor_tiers_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "sponsor_tiers_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "sponsor_tiers_delete";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sponsor_tiers_id";`)
}
