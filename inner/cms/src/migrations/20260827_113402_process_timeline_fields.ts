import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_blocks_timeline_points_state" AS ENUM('done', 'current', 'upcoming');
  ALTER TABLE "projects_blocks_timeline_points" ADD COLUMN "state" "enum_projects_blocks_timeline_points_state";
  ALTER TABLE "projects_blocks_timeline_points" ADD COLUMN "image_id" integer;
  ALTER TABLE "projects_blocks_timeline_points_locales" ADD COLUMN "timing" varchar;
  ALTER TABLE "homepage_steps" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "homepage_steps_locales" ADD COLUMN "timing" varchar;
  ALTER TABLE "homepage_steps_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "projects_blocks_timeline_points" ADD CONSTRAINT "projects_blocks_timeline_points_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_blocks_timeline_points_image_idx" ON "projects_blocks_timeline_points" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_blocks_timeline_points" DROP CONSTRAINT "projects_blocks_timeline_points_image_id_media_id_fk";
  
  DROP INDEX "projects_blocks_timeline_points_image_idx";
  ALTER TABLE "projects_blocks_timeline_points" DROP COLUMN "state";
  ALTER TABLE "projects_blocks_timeline_points" DROP COLUMN "image_id";
  ALTER TABLE "projects_blocks_timeline_points_locales" DROP COLUMN "timing";
  ALTER TABLE "homepage_steps" DROP COLUMN "cta_href";
  ALTER TABLE "homepage_steps_locales" DROP COLUMN "timing";
  ALTER TABLE "homepage_steps_locales" DROP COLUMN "cta_label";
  DROP TYPE "public"."enum_projects_blocks_timeline_points_state";`)
}
