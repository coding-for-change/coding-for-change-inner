import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partner_value_props" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partner_value_props_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partner_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partner_process_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partner" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "partner_locales" (
  	"title" varchar,
  	"intro" varchar,
  	"commitment" varchar,
  	"cta_heading" varchar,
  	"cta_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "projects" ADD COLUMN "slug" varchar;
  ALTER TABLE "projects" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "projects" ADD COLUMN "quote_author" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "problem" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "approach" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "outcome" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "impact" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "quote_text" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "quote_role" varchar;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "partner_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "partner_update" boolean DEFAULT false;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery_locales" ADD CONSTRAINT "projects_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partner_value_props" ADD CONSTRAINT "partner_value_props_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partner_value_props_locales" ADD CONSTRAINT "partner_value_props_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner_value_props"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partner_process" ADD CONSTRAINT "partner_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partner_process_locales" ADD CONSTRAINT "partner_process_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partner_locales" ADD CONSTRAINT "partner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_gallery_locales_locale_parent_id_unique" ON "projects_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partner_value_props_order_idx" ON "partner_value_props" USING btree ("_order");
  CREATE INDEX "partner_value_props_parent_id_idx" ON "partner_value_props" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partner_value_props_locales_locale_parent_id_unique" ON "partner_value_props_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partner_process_order_idx" ON "partner_process" USING btree ("_order");
  CREATE INDEX "partner_process_parent_id_idx" ON "partner_process" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partner_process_locales_locale_parent_id_unique" ON "partner_process_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "partner_locales_locale_parent_id_unique" ON "partner_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partner_value_props" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partner_value_props_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partner_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partner_process_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partner_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_gallery_locales" CASCADE;
  DROP TABLE "partner_value_props" CASCADE;
  DROP TABLE "partner_value_props_locales" CASCADE;
  DROP TABLE "partner_process" CASCADE;
  DROP TABLE "partner_process_locales" CASCADE;
  DROP TABLE "partner" CASCADE;
  DROP TABLE "partner_locales" CASCADE;
  DROP INDEX "projects_slug_idx";
  ALTER TABLE "projects" DROP COLUMN "slug";
  ALTER TABLE "projects" DROP COLUMN "featured";
  ALTER TABLE "projects" DROP COLUMN "quote_author";
  ALTER TABLE "projects_locales" DROP COLUMN "problem";
  ALTER TABLE "projects_locales" DROP COLUMN "approach";
  ALTER TABLE "projects_locales" DROP COLUMN "outcome";
  ALTER TABLE "projects_locales" DROP COLUMN "impact";
  ALTER TABLE "projects_locales" DROP COLUMN "quote_text";
  ALTER TABLE "projects_locales" DROP COLUMN "quote_role";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "partner_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "partner_update";`)
}
