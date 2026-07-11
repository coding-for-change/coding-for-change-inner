import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_faq_category" ADD VALUE 'about' BEFORE 'membership';
  CREATE TABLE "about_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_facts_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_steps_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"outlet" varchar NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "about_media_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_doors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar NOT NULL
  );
  
  CREATE TABLE "about_doors_locales" (
  	"audience" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_locales" (
  	"kicker" varchar,
  	"title" varchar NOT NULL,
  	"definition" jsonb NOT NULL,
  	"tagline" varchar,
  	"how_title" varchar,
  	"how_intro" varchar,
  	"people_title" varchar,
  	"people_body" jsonb,
  	"work_title" varchar,
  	"work_intro" varchar,
  	"funding_title" varchar,
  	"funding_body" jsonb,
  	"media_title" varchar,
  	"faq_title" varchar,
  	"faq_intro" varchar,
  	"cta_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "about_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "about_update" boolean DEFAULT false;
  ALTER TABLE "about_facts" ADD CONSTRAINT "about_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_facts_locales" ADD CONSTRAINT "about_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_steps" ADD CONSTRAINT "about_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_steps_locales" ADD CONSTRAINT "about_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_media" ADD CONSTRAINT "about_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_media_locales" ADD CONSTRAINT "about_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_doors" ADD CONSTRAINT "about_doors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_doors_locales" ADD CONSTRAINT "about_doors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_doors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_facts_order_idx" ON "about_facts" USING btree ("_order");
  CREATE INDEX "about_facts_parent_id_idx" ON "about_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_facts_locales_locale_parent_id_unique" ON "about_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_steps_order_idx" ON "about_steps" USING btree ("_order");
  CREATE INDEX "about_steps_parent_id_idx" ON "about_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_steps_locales_locale_parent_id_unique" ON "about_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_media_order_idx" ON "about_media" USING btree ("_order");
  CREATE INDEX "about_media_parent_id_idx" ON "about_media" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_media_locales_locale_parent_id_unique" ON "about_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_doors_order_idx" ON "about_doors" USING btree ("_order");
  CREATE INDEX "about_doors_parent_id_idx" ON "about_doors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_doors_locales_locale_parent_id_unique" ON "about_doors_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_facts" CASCADE;
  DROP TABLE "about_facts_locales" CASCADE;
  DROP TABLE "about_steps" CASCADE;
  DROP TABLE "about_steps_locales" CASCADE;
  DROP TABLE "about_media" CASCADE;
  DROP TABLE "about_media_locales" CASCADE;
  DROP TABLE "about_doors" CASCADE;
  DROP TABLE "about_doors_locales" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  ALTER TABLE "faq" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_faq_category";
  CREATE TYPE "public"."enum_faq_category" AS ENUM('general', 'membership', 'projects', 'technical');
  ALTER TABLE "faq" ALTER COLUMN "category" SET DATA TYPE "public"."enum_faq_category" USING "category"::"public"."enum_faq_category";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "about_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "about_update";`)
}
