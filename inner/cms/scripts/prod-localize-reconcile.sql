-- One-time reconcile: bring a pre-localization (push-managed) Payload DB up to the
-- localized schema produced by migration 20260604_112404_initial, WITHOUT data loss.
--
-- It creates the missing *_locales tables (+ legal/legal_locales), copies each existing
-- localized column value into its _locales table under the 'en' locale, drops the old
-- columns, and records the baseline migration as applied so future `payload migrate`
-- runs start from a clean baseline.
--
-- Safe to run once on a DB that still has the OLD (pre-localization) schema.
-- Wrapped in a transaction: any error rolls the whole thing back.

BEGIN;

-- 1. Locale enum -------------------------------------------------------------
CREATE TYPE "public"."_locales" AS ENUM('en', 'de');

-- 2. New localized tables ----------------------------------------------------
CREATE TABLE "team_locales" (
  "role" varchar NOT NULL, "bio" varchar NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" integer NOT NULL);

CREATE TABLE "projects_technologies_locales" (
  "name" varchar NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL);

CREATE TABLE "projects_links_locales" (
  "label" varchar NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL);

CREATE TABLE "projects_locales" (
  "title" varchar NOT NULL, "ngo_partner" varchar NOT NULL, "description" varchar NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" integer NOT NULL);

CREATE TABLE "events_locales" (
  "title" varchar NOT NULL, "location" varchar NOT NULL, "description" varchar NOT NULL, "link_label" varchar,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" integer NOT NULL);

CREATE TABLE "faq_locales" (
  "question" varchar NOT NULL, "answer" varchar NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" integer NOT NULL);

CREATE TABLE "sponsors_locales" (
  "description" varchar,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" integer NOT NULL);

CREATE TABLE "site_config_locales" (
  "tagline" varchar NOT NULL, "description" varchar NOT NULL, "copyright_text" varchar, "window_title" varchar,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" integer NOT NULL);

CREATE TABLE "membership_benefits_locales" (
  "text" varchar NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL);

CREATE TABLE "membership_requirements_locales" (
  "text" varchar NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL);

CREATE TABLE "membership_locales" (
  "title" varchar NOT NULL, "description" varchar NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" integer NOT NULL);

CREATE TABLE "legal" (
  "id" serial PRIMARY KEY NOT NULL,
  "updated_at" timestamp(3) with time zone, "created_at" timestamp(3) with time zone);

CREATE TABLE "legal_locales" (
  "impressum" jsonb NOT NULL, "privacy_policy" jsonb NOT NULL,
  "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" integer NOT NULL);

-- 3. Copy existing content into the 'en' locale ------------------------------
INSERT INTO "projects_locales" ("_parent_id","_locale","title","ngo_partner","description")
  SELECT "id",'en',"title","ngo_partner","description" FROM "projects";
INSERT INTO "projects_technologies_locales" ("_parent_id","_locale","name")
  SELECT "id",'en',"name" FROM "projects_technologies";
INSERT INTO "projects_links_locales" ("_parent_id","_locale","label")
  SELECT "id",'en',"label" FROM "projects_links";
INSERT INTO "events_locales" ("_parent_id","_locale","title","location","description","link_label")
  SELECT "id",'en',"title","location","description","link_label" FROM "events";
INSERT INTO "team_locales" ("_parent_id","_locale","role","bio")
  SELECT "id",'en',"role","bio" FROM "team";
INSERT INTO "faq_locales" ("_parent_id","_locale","question","answer")
  SELECT "id",'en',"question","answer" FROM "faq";
INSERT INTO "sponsors_locales" ("_parent_id","_locale","description")
  SELECT "id",'en',"description" FROM "sponsors";
INSERT INTO "site_config_locales" ("_parent_id","_locale","tagline","description","copyright_text","window_title")
  SELECT "id",'en',"tagline","description","copyright_text","window_title" FROM "site_config";
INSERT INTO "membership_locales" ("_parent_id","_locale","title","description")
  SELECT "id",'en',"title","description" FROM "membership";
INSERT INTO "membership_benefits_locales" ("_parent_id","_locale","text")
  SELECT "id",'en',"text" FROM "membership_benefits";
INSERT INTO "membership_requirements_locales" ("_parent_id","_locale","text")
  SELECT "id",'en',"text" FROM "membership_requirements";

-- 4. Drop the now-migrated old columns ---------------------------------------
ALTER TABLE "projects" DROP COLUMN "title", DROP COLUMN "ngo_partner", DROP COLUMN "description";
ALTER TABLE "projects_technologies" DROP COLUMN "name";
ALTER TABLE "projects_links" DROP COLUMN "label";
ALTER TABLE "events" DROP COLUMN "title", DROP COLUMN "location", DROP COLUMN "description", DROP COLUMN "link_label";
ALTER TABLE "team" DROP COLUMN "role", DROP COLUMN "bio";
ALTER TABLE "faq" DROP COLUMN "question", DROP COLUMN "answer";
ALTER TABLE "sponsors" DROP COLUMN "description";
ALTER TABLE "site_config" DROP COLUMN "tagline", DROP COLUMN "description", DROP COLUMN "copyright_text", DROP COLUMN "window_title";
ALTER TABLE "membership" DROP COLUMN "title", DROP COLUMN "description";
ALTER TABLE "membership_benefits" DROP COLUMN "text";
ALTER TABLE "membership_requirements" DROP COLUMN "text";

-- 5. Foreign keys for the new _locales tables --------------------------------
ALTER TABLE "team_locales" ADD CONSTRAINT "team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "projects_technologies_locales" ADD CONSTRAINT "projects_technologies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_technologies"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "projects_links_locales" ADD CONSTRAINT "projects_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_links"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "faq_locales" ADD CONSTRAINT "faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "sponsors_locales" ADD CONSTRAINT "sponsors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "site_config_locales" ADD CONSTRAINT "site_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "membership_benefits_locales" ADD CONSTRAINT "membership_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_benefits"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "membership_requirements_locales" ADD CONSTRAINT "membership_requirements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_requirements"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "membership_locales" ADD CONSTRAINT "membership_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "legal_locales" ADD CONSTRAINT "legal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;

-- 6. Unique indexes on (_locale, _parent_id) ---------------------------------
CREATE UNIQUE INDEX "team_locales_locale_parent_id_unique" ON "team_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "projects_technologies_locales_locale_parent_id_unique" ON "projects_technologies_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "projects_links_locales_locale_parent_id_unique" ON "projects_links_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "faq_locales_locale_parent_id_unique" ON "faq_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "sponsors_locales_locale_parent_id_unique" ON "sponsors_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "site_config_locales_locale_parent_id_unique" ON "site_config_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "membership_benefits_locales_locale_parent_id_unique" ON "membership_benefits_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "membership_requirements_locales_locale_parent_id_unique" ON "membership_requirements_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "membership_locales_locale_parent_id_unique" ON "membership_locales" USING btree ("_locale","_parent_id");
CREATE UNIQUE INDEX "legal_locales_locale_parent_id_unique" ON "legal_locales" USING btree ("_locale","_parent_id");

-- 7. Record the baseline migration as applied; drop the dev push marker ------
DELETE FROM "payload_migrations" WHERE "name" = 'dev';
INSERT INTO "payload_migrations" ("name","batch") VALUES ('20260604_112404_initial', 1);

COMMIT;
