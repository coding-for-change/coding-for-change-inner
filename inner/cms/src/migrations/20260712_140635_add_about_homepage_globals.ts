import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_story_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_values_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
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
  	"title" varchar,
  	"lead" varchar,
  	"values_title" varchar,
  	"team_teaser" varchar,
  	"team_cta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_stats_locales" (
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_steps_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_locales" (
  	"hero_kicker" varchar,
  	"hero_cta_primary" varchar,
  	"hero_cta_secondary" varchar,
  	"hero_scroll_hint" varchar,
  	"about_kicker" varchar,
  	"about_one_liner" varchar,
  	"about_pitch" varchar,
  	"process_kicker" varchar,
  	"process_heading" varchar,
  	"process_intro" varchar,
  	"projects_subtitle" varchar,
  	"projects_title" varchar,
  	"projects_intro" varchar,
  	"events_subtitle" varchar,
  	"events_title" varchar,
  	"events_intro" varchar,
  	"sponsors_subtitle" varchar,
  	"sponsors_title" varchar,
  	"sponsors_intro" varchar,
  	"qa_subtitle" varchar,
  	"qa_title" varchar,
  	"qa_intro" varchar,
  	"threed_kicker" varchar,
  	"threed_title" varchar,
  	"threed_text" varchar,
  	"threed_cta" varchar,
  	"cta_heading" varchar,
  	"cta_text" varchar,
  	"cta_join" varchar,
  	"cta_contact" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "about_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "about_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "homepage_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "homepage_update" boolean DEFAULT false;
  ALTER TABLE "about_story" ADD CONSTRAINT "about_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_story_locales" ADD CONSTRAINT "about_story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_values" ADD CONSTRAINT "about_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_values_locales" ADD CONSTRAINT "about_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_stats" ADD CONSTRAINT "homepage_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_stats_locales" ADD CONSTRAINT "homepage_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_steps" ADD CONSTRAINT "homepage_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_steps_locales" ADD CONSTRAINT "homepage_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_story_order_idx" ON "about_story" USING btree ("_order");
  CREATE INDEX "about_story_parent_id_idx" ON "about_story" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_story_locales_locale_parent_id_unique" ON "about_story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_values_order_idx" ON "about_values" USING btree ("_order");
  CREATE INDEX "about_values_parent_id_idx" ON "about_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_values_locales_locale_parent_id_unique" ON "about_values_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_stats_order_idx" ON "homepage_stats" USING btree ("_order");
  CREATE INDEX "homepage_stats_parent_id_idx" ON "homepage_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_stats_locales_locale_parent_id_unique" ON "homepage_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_steps_order_idx" ON "homepage_steps" USING btree ("_order");
  CREATE INDEX "homepage_steps_parent_id_idx" ON "homepage_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_steps_locales_locale_parent_id_unique" ON "homepage_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "homepage_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_story" CASCADE;
  DROP TABLE "about_story_locales" CASCADE;
  DROP TABLE "about_values" CASCADE;
  DROP TABLE "about_values_locales" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  DROP TABLE "homepage_stats" CASCADE;
  DROP TABLE "homepage_stats_locales" CASCADE;
  DROP TABLE "homepage_steps" CASCADE;
  DROP TABLE "homepage_steps_locales" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_locales" CASCADE;
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "about_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "about_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "homepage_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "homepage_update";`)
}
