import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "site_config" ADD COLUMN "team_hero_image_id" integer;
  ALTER TABLE "membership" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "partner" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "projects_impact_gallery" ADD CONSTRAINT "projects_impact_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_impact_gallery" ADD CONSTRAINT "projects_impact_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_impact_gallery_locales" ADD CONSTRAINT "projects_impact_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_impact_gallery"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_impact_gallery_order_idx" ON "projects_impact_gallery" USING btree ("_order");
  CREATE INDEX "projects_impact_gallery_parent_id_idx" ON "projects_impact_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_impact_gallery_image_idx" ON "projects_impact_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_impact_gallery_locales_locale_parent_id_unique" ON "projects_impact_gallery_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_team_hero_image_id_media_id_fk" FOREIGN KEY ("team_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "membership" ADD CONSTRAINT "membership_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partner" ADD CONSTRAINT "partner_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_config_team_hero_image_idx" ON "site_config" USING btree ("team_hero_image_id");
  CREATE INDEX "membership_hero_image_idx" ON "membership" USING btree ("hero_image_id");
  CREATE INDEX "partner_hero_image_idx" ON "partner" USING btree ("hero_image_id");
  CREATE INDEX "homepage_hero_image_idx" ON "homepage" USING btree ("hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_impact_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_impact_gallery_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_impact_gallery" CASCADE;
  DROP TABLE "projects_impact_gallery_locales" CASCADE;
  ALTER TABLE "site_config" DROP CONSTRAINT "site_config_team_hero_image_id_media_id_fk";
  
  ALTER TABLE "membership" DROP CONSTRAINT "membership_hero_image_id_media_id_fk";
  
  ALTER TABLE "partner" DROP CONSTRAINT "partner_hero_image_id_media_id_fk";
  
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_hero_image_id_media_id_fk";
  
  DROP INDEX "site_config_team_hero_image_idx";
  DROP INDEX "membership_hero_image_idx";
  DROP INDEX "partner_hero_image_idx";
  DROP INDEX "homepage_hero_image_idx";
  ALTER TABLE "site_config" DROP COLUMN "team_hero_image_id";
  ALTER TABLE "membership" DROP COLUMN "hero_image_id";
  ALTER TABLE "partner" DROP COLUMN "hero_image_id";
  ALTER TABLE "homepage" DROP COLUMN "hero_image_id";`)
}
