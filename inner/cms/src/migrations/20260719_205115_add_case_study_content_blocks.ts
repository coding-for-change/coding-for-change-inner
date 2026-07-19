import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Create the new content-block tables, their FKs and indexes. (The old
  //    fields/tables are dropped in step 3, AFTER their data is copied over.)
  await db.execute(sql`
   CREATE TABLE "projects_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "projects_blocks_text_locales" (
  	"heading" varchar,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "projects_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "projects_blocks_quote_locales" (
  	"text" varchar NOT NULL,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "projects_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );

  CREATE TABLE "projects_blocks_gallery_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "projects_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "projects_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE "projects_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "projects_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );

  ALTER TABLE "projects_blocks_text" ADD CONSTRAINT "projects_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_text_locales" ADD CONSTRAINT "projects_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quote" ADD CONSTRAINT "projects_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quote_locales" ADD CONSTRAINT "projects_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_gallery_images" ADD CONSTRAINT "projects_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_gallery_images" ADD CONSTRAINT "projects_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_gallery_images_locales" ADD CONSTRAINT "projects_blocks_gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_gallery" ADD CONSTRAINT "projects_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_faq_items" ADD CONSTRAINT "projects_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_faq_items_locales" ADD CONSTRAINT "projects_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_faq" ADD CONSTRAINT "projects_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_blocks_text_order_idx" ON "projects_blocks_text" USING btree ("_order");
  CREATE INDEX "projects_blocks_text_parent_id_idx" ON "projects_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_text_path_idx" ON "projects_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_blocks_text_locales_locale_parent_id_unique" ON "projects_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_quote_order_idx" ON "projects_blocks_quote" USING btree ("_order");
  CREATE INDEX "projects_blocks_quote_parent_id_idx" ON "projects_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_quote_path_idx" ON "projects_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_blocks_quote_locales_locale_parent_id_unique" ON "projects_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_gallery_images_order_idx" ON "projects_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "projects_blocks_gallery_images_parent_id_idx" ON "projects_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_gallery_images_image_idx" ON "projects_blocks_gallery_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_blocks_gallery_images_locales_locale_parent_id_uniq" ON "projects_blocks_gallery_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_gallery_order_idx" ON "projects_blocks_gallery" USING btree ("_order");
  CREATE INDEX "projects_blocks_gallery_parent_id_idx" ON "projects_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_gallery_path_idx" ON "projects_blocks_gallery" USING btree ("_path");
  CREATE INDEX "projects_blocks_faq_items_order_idx" ON "projects_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_faq_items_parent_id_idx" ON "projects_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_faq_items_locales_locale_parent_id_unique" ON "projects_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_faq_order_idx" ON "projects_blocks_faq" USING btree ("_order");
  CREATE INDEX "projects_blocks_faq_parent_id_idx" ON "projects_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_faq_path_idx" ON "projects_blocks_faq" USING btree ("_path");`)

  // 2. Migrate existing impact-story content into `layout` blocks, in the order
  //    the old impact view rendered them: challenge, solution, gallery, results,
  //    quote, faq. Deterministic ids keep base rows and their locale rows linked.
  //    (Technical fields problem/approach/outcome are intentionally NOT migrated.)
  await db.execute(sql`
   -- Challenge → text block (_order 1)
  INSERT INTO "projects_blocks_text" ("_order","_parent_id","_path","id")
  SELECT 1, p.id, 'layout', 'mig_challenge_' || p.id
  FROM "projects" p WHERE EXISTS (SELECT 1 FROM "projects_locales" l WHERE l._parent_id = p.id AND COALESCE(l.impact_challenge,'') <> '');
  INSERT INTO "projects_blocks_text_locales" ("heading","body","_locale","_parent_id")
  SELECT CASE WHEN l._locale::text = 'de' THEN 'Die Herausforderung' ELSE 'The challenge' END, l.impact_challenge, l._locale, 'mig_challenge_' || l._parent_id
  FROM "projects_locales" l WHERE COALESCE(l.impact_challenge,'') <> '';

  -- Solution → text block (_order 2)
  INSERT INTO "projects_blocks_text" ("_order","_parent_id","_path","id")
  SELECT 2, p.id, 'layout', 'mig_solution_' || p.id
  FROM "projects" p WHERE EXISTS (SELECT 1 FROM "projects_locales" l WHERE l._parent_id = p.id AND COALESCE(l.impact_solution,'') <> '');
  INSERT INTO "projects_blocks_text_locales" ("heading","body","_locale","_parent_id")
  SELECT CASE WHEN l._locale::text = 'de' THEN 'Die Lösung' ELSE 'The solution' END, l.impact_solution, l._locale, 'mig_solution_' || l._parent_id
  FROM "projects_locales" l WHERE COALESCE(l.impact_solution,'') <> '';

  -- Gallery → gallery block (_order 3), preferring impact photos, else screenshots.
  INSERT INTO "projects_blocks_gallery" ("_order","_parent_id","_path","id")
  SELECT 3, p.id, 'layout', 'mig_gallery_' || p.id
  FROM "projects" p WHERE EXISTS (SELECT 1 FROM "projects_impact_gallery" g WHERE g._parent_id = p.id)
     OR EXISTS (SELECT 1 FROM "projects_gallery" g WHERE g._parent_id = p.id);
  -- images from impact_gallery (when present)
  INSERT INTO "projects_blocks_gallery_images" ("_order","_parent_id","id","image_id")
  SELECT g._order, 'mig_gallery_' || g._parent_id, 'mig_ig_' || g.id, g.image_id
  FROM "projects_impact_gallery" g;
  INSERT INTO "projects_blocks_gallery_images_locales" ("caption","_locale","_parent_id")
  SELECT gl.caption, gl._locale, 'mig_ig_' || gl._parent_id
  FROM "projects_impact_gallery_locales" gl;
  -- images from gallery (only for projects with no impact_gallery)
  INSERT INTO "projects_blocks_gallery_images" ("_order","_parent_id","id","image_id")
  SELECT g._order, 'mig_gallery_' || g._parent_id, 'mig_g_' || g.id, g.image_id
  FROM "projects_gallery" g
  WHERE NOT EXISTS (SELECT 1 FROM "projects_impact_gallery" ig WHERE ig._parent_id = g._parent_id);
  INSERT INTO "projects_blocks_gallery_images_locales" ("caption","_locale","_parent_id")
  SELECT gl.caption, gl._locale, 'mig_g_' || gl._parent_id
  FROM "projects_gallery_locales" gl
  WHERE EXISTS (SELECT 1 FROM "projects_gallery" g WHERE g.id = gl._parent_id AND NOT EXISTS (SELECT 1 FROM "projects_impact_gallery" ig WHERE ig._parent_id = g._parent_id));

  -- Results → text block (_order 4)
  INSERT INTO "projects_blocks_text" ("_order","_parent_id","_path","id")
  SELECT 4, p.id, 'layout', 'mig_results_' || p.id
  FROM "projects" p WHERE EXISTS (SELECT 1 FROM "projects_locales" l WHERE l._parent_id = p.id AND COALESCE(l.impact_results,'') <> '');
  INSERT INTO "projects_blocks_text_locales" ("heading","body","_locale","_parent_id")
  SELECT CASE WHEN l._locale::text = 'de' THEN 'Das Ergebnis' ELSE 'The results' END, l.impact_results, l._locale, 'mig_results_' || l._parent_id
  FROM "projects_locales" l WHERE COALESCE(l.impact_results,'') <> '';

  -- Quote → quote block (_order 5)
  INSERT INTO "projects_blocks_quote" ("_order","_parent_id","_path","id","author")
  SELECT 5, p.id, 'layout', 'mig_quote_' || p.id, p.quote_author
  FROM "projects" p WHERE EXISTS (SELECT 1 FROM "projects_locales" l WHERE l._parent_id = p.id AND COALESCE(l.quote_text,'') <> '');
  INSERT INTO "projects_blocks_quote_locales" ("text","role","_locale","_parent_id")
  SELECT l.quote_text, l.quote_role, l._locale, 'mig_quote_' || l._parent_id
  FROM "projects_locales" l WHERE COALESCE(l.quote_text,'') <> '';

  -- NGO FAQ → faq block (_order 6)
  INSERT INTO "projects_blocks_faq" ("_order","_parent_id","_path","id")
  SELECT 6, p.id, 'layout', 'mig_faq_' || p.id
  FROM "projects" p WHERE EXISTS (SELECT 1 FROM "projects_ngo_faq" f WHERE f._parent_id = p.id);
  INSERT INTO "projects_blocks_faq_items" ("_order","_parent_id","id")
  SELECT f._order, 'mig_faq_' || f._parent_id, 'mig_faqi_' || f.id
  FROM "projects_ngo_faq" f;
  INSERT INTO "projects_blocks_faq_items_locales" ("question","answer","_locale","_parent_id")
  SELECT fl.question, fl.answer, fl._locale, 'mig_faqi_' || fl._parent_id
  FROM "projects_ngo_faq_locales" fl;`)

  // 3. Drop the retired fields/tables now that their content lives in blocks.
  //    (problem/approach/outcome — the technical narrative — are dropped without
  //    migration, per the decision to keep only the impact story.)
  await db.execute(sql`
   DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_gallery_locales" CASCADE;
  DROP TABLE "projects_impact_gallery" CASCADE;
  DROP TABLE "projects_impact_gallery_locales" CASCADE;
  DROP TABLE "projects_ngo_faq" CASCADE;
  DROP TABLE "projects_ngo_faq_locales" CASCADE;
  ALTER TABLE "projects_blocks_timeline" DROP COLUMN "visibility";
  ALTER TABLE "projects_blocks_team" DROP COLUMN "visibility";
  ALTER TABLE "projects" DROP COLUMN "quote_author";
  ALTER TABLE "projects_locales" DROP COLUMN "problem";
  ALTER TABLE "projects_locales" DROP COLUMN "approach";
  ALTER TABLE "projects_locales" DROP COLUMN "outcome";
  ALTER TABLE "projects_locales" DROP COLUMN "quote_text";
  ALTER TABLE "projects_locales" DROP COLUMN "quote_role";
  ALTER TABLE "projects_locales" DROP COLUMN "impact_challenge";
  ALTER TABLE "projects_locales" DROP COLUMN "impact_solution";
  ALTER TABLE "projects_locales" DROP COLUMN "impact_results";
  DROP TYPE "public"."enum_projects_blocks_timeline_visibility";
  DROP TYPE "public"."enum_projects_blocks_team_visibility";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_blocks_timeline_visibility" AS ENUM('both', 'technical', 'impact');
  CREATE TYPE "public"."enum_projects_blocks_team_visibility" AS ENUM('both', 'technical', 'impact');
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

  CREATE TABLE "projects_impact_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );

  CREATE TABLE "projects_impact_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "projects_ngo_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );

  CREATE TABLE "projects_ngo_faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  DROP TABLE "projects_blocks_text" CASCADE;
  DROP TABLE "projects_blocks_text_locales" CASCADE;
  DROP TABLE "projects_blocks_quote" CASCADE;
  DROP TABLE "projects_blocks_quote_locales" CASCADE;
  DROP TABLE "projects_blocks_gallery_images" CASCADE;
  DROP TABLE "projects_blocks_gallery_images_locales" CASCADE;
  DROP TABLE "projects_blocks_gallery" CASCADE;
  DROP TABLE "projects_blocks_faq_items" CASCADE;
  DROP TABLE "projects_blocks_faq_items_locales" CASCADE;
  DROP TABLE "projects_blocks_faq" CASCADE;
  ALTER TABLE "projects_blocks_timeline" ADD COLUMN "visibility" "enum_projects_blocks_timeline_visibility" DEFAULT 'both';
  ALTER TABLE "projects_blocks_team" ADD COLUMN "visibility" "enum_projects_blocks_team_visibility" DEFAULT 'both';
  ALTER TABLE "projects" ADD COLUMN "quote_author" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "problem" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "approach" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "outcome" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "quote_text" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "quote_role" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "impact_challenge" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "impact_solution" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "impact_results" varchar;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery_locales" ADD CONSTRAINT "projects_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_impact_gallery" ADD CONSTRAINT "projects_impact_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_impact_gallery" ADD CONSTRAINT "projects_impact_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_impact_gallery_locales" ADD CONSTRAINT "projects_impact_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_impact_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_ngo_faq" ADD CONSTRAINT "projects_ngo_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_ngo_faq_locales" ADD CONSTRAINT "projects_ngo_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_ngo_faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_gallery_locales_locale_parent_id_unique" ON "projects_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_impact_gallery_order_idx" ON "projects_impact_gallery" USING btree ("_order");
  CREATE INDEX "projects_impact_gallery_parent_id_idx" ON "projects_impact_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_impact_gallery_image_idx" ON "projects_impact_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_impact_gallery_locales_locale_parent_id_unique" ON "projects_impact_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_ngo_faq_order_idx" ON "projects_ngo_faq" USING btree ("_order");
  CREATE INDEX "projects_ngo_faq_parent_id_idx" ON "projects_ngo_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_ngo_faq_locales_locale_parent_id_unique" ON "projects_ngo_faq_locales" USING btree ("_locale","_parent_id");`)
}
