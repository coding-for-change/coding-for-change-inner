import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_blocks_gallery_layout" AS ENUM('stage', 'photos');
  CREATE TABLE "projects_blocks_gallery_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_demo" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"embed_url" varchar,
  	"poster_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_demo_locales" (
  	"heading" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "projects_blocks_gallery" ADD COLUMN "layout" "enum_projects_blocks_gallery_layout" DEFAULT 'stage';
  ALTER TABLE "projects_blocks_gallery_locales" ADD CONSTRAINT "projects_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_demo" ADD CONSTRAINT "projects_blocks_demo_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_demo" ADD CONSTRAINT "projects_blocks_demo_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_demo" ADD CONSTRAINT "projects_blocks_demo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_demo_locales" ADD CONSTRAINT "projects_blocks_demo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_demo"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "projects_blocks_gallery_locales_locale_parent_id_unique" ON "projects_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_demo_order_idx" ON "projects_blocks_demo" USING btree ("_order");
  CREATE INDEX "projects_blocks_demo_parent_id_idx" ON "projects_blocks_demo" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_demo_path_idx" ON "projects_blocks_demo" USING btree ("_path");
  CREATE INDEX "projects_blocks_demo_video_idx" ON "projects_blocks_demo" USING btree ("video_id");
  CREATE INDEX "projects_blocks_demo_poster_idx" ON "projects_blocks_demo" USING btree ("poster_id");
  CREATE UNIQUE INDEX "projects_blocks_demo_locales_locale_parent_id_unique" ON "projects_blocks_demo_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_blocks_gallery_locales" CASCADE;
  DROP TABLE "projects_blocks_demo" CASCADE;
  DROP TABLE "projects_blocks_demo_locales" CASCADE;
  ALTER TABLE "projects_blocks_gallery" DROP COLUMN "layout";
  DROP TYPE "public"."enum_projects_blocks_gallery_layout";`)
}
