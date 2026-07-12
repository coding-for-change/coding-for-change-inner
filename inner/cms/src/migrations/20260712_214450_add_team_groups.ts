import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "team_team_memberships" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"team_id" integer NOT NULL
  );
  
  CREATE TABLE "team_team_memberships_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "team_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_groups_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_groups_id" integer;
  ALTER TABLE "team_team_memberships" ADD CONSTRAINT "team_team_memberships_team_id_team_groups_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_team_memberships" ADD CONSTRAINT "team_team_memberships_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_team_memberships_locales" ADD CONSTRAINT "team_team_memberships_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_team_memberships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_groups" ADD CONSTRAINT "team_groups_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_groups_locales" ADD CONSTRAINT "team_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_groups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "team_team_memberships_order_idx" ON "team_team_memberships" USING btree ("_order");
  CREATE INDEX "team_team_memberships_parent_id_idx" ON "team_team_memberships" USING btree ("_parent_id");
  CREATE INDEX "team_team_memberships_team_idx" ON "team_team_memberships" USING btree ("team_id");
  CREATE UNIQUE INDEX "team_team_memberships_locales_locale_parent_id_unique" ON "team_team_memberships_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_groups_logo_idx" ON "team_groups" USING btree ("logo_id");
  CREATE INDEX "team_groups_updated_at_idx" ON "team_groups" USING btree ("updated_at");
  CREATE INDEX "team_groups_created_at_idx" ON "team_groups" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_groups_locales_locale_parent_id_unique" ON "team_groups_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_groups_fk" FOREIGN KEY ("team_groups_id") REFERENCES "public"."team_groups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_team_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("team_groups_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_team_memberships" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_team_memberships_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_groups_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "team_team_memberships" CASCADE;
  DROP TABLE "team_team_memberships_locales" CASCADE;
  DROP TABLE "team_groups" CASCADE;
  DROP TABLE "team_groups_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_groups_fk";
  
  DROP INDEX "payload_locked_documents_rels_team_groups_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_groups_id";`)
}
