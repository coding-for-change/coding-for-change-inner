import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_blocks_timeline_visibility" AS ENUM('both', 'technical', 'impact');
  CREATE TYPE "public"."enum_projects_blocks_team_visibility" AS ENUM('both', 'technical', 'impact');
  CREATE TABLE "projects_blocks_timeline_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"marker" varchar
  );
  
  CREATE TABLE "projects_blocks_timeline_points_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visibility" "enum_projects_blocks_timeline_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_timeline_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_blocks_team_members_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visibility" "enum_projects_blocks_team_visibility" DEFAULT 'both',
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_team_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "projects_blocks_timeline_points" ADD CONSTRAINT "projects_blocks_timeline_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_timeline_points_locales" ADD CONSTRAINT "projects_blocks_timeline_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_timeline_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_timeline" ADD CONSTRAINT "projects_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_timeline_locales" ADD CONSTRAINT "projects_blocks_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_team_members" ADD CONSTRAINT "projects_blocks_team_members_member_id_team_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_team_members" ADD CONSTRAINT "projects_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_team_members_locales" ADD CONSTRAINT "projects_blocks_team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_team" ADD CONSTRAINT "projects_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_team_locales" ADD CONSTRAINT "projects_blocks_team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_blocks_timeline_points_order_idx" ON "projects_blocks_timeline_points" USING btree ("_order");
  CREATE INDEX "projects_blocks_timeline_points_parent_id_idx" ON "projects_blocks_timeline_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_timeline_points_locales_locale_parent_id_uni" ON "projects_blocks_timeline_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_timeline_order_idx" ON "projects_blocks_timeline" USING btree ("_order");
  CREATE INDEX "projects_blocks_timeline_parent_id_idx" ON "projects_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_timeline_path_idx" ON "projects_blocks_timeline" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_blocks_timeline_locales_locale_parent_id_unique" ON "projects_blocks_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_team_members_order_idx" ON "projects_blocks_team_members" USING btree ("_order");
  CREATE INDEX "projects_blocks_team_members_parent_id_idx" ON "projects_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_team_members_member_idx" ON "projects_blocks_team_members" USING btree ("member_id");
  CREATE UNIQUE INDEX "projects_blocks_team_members_locales_locale_parent_id_unique" ON "projects_blocks_team_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_team_order_idx" ON "projects_blocks_team" USING btree ("_order");
  CREATE INDEX "projects_blocks_team_parent_id_idx" ON "projects_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_team_path_idx" ON "projects_blocks_team" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_blocks_team_locales_locale_parent_id_unique" ON "projects_blocks_team_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_blocks_timeline_points" CASCADE;
  DROP TABLE "projects_blocks_timeline_points_locales" CASCADE;
  DROP TABLE "projects_blocks_timeline" CASCADE;
  DROP TABLE "projects_blocks_timeline_locales" CASCADE;
  DROP TABLE "projects_blocks_team_members" CASCADE;
  DROP TABLE "projects_blocks_team_members_locales" CASCADE;
  DROP TABLE "projects_blocks_team" CASCADE;
  DROP TABLE "projects_blocks_team_locales" CASCADE;
  DROP TYPE "public"."enum_projects_blocks_timeline_visibility";
  DROP TYPE "public"."enum_projects_blocks_team_visibility";`)
}
