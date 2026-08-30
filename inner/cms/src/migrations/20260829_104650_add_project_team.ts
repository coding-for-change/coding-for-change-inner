import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_team_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "projects_team" ADD CONSTRAINT "projects_team_member_id_team_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_team" ADD CONSTRAINT "projects_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_team_locales" ADD CONSTRAINT "projects_team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_team"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_team_order_idx" ON "projects_team" USING btree ("_order");
  CREATE INDEX "projects_team_parent_id_idx" ON "projects_team" USING btree ("_parent_id");
  CREATE INDEX "projects_team_member_idx" ON "projects_team" USING btree ("member_id");
  CREATE UNIQUE INDEX "projects_team_locales_locale_parent_id_unique" ON "projects_team_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_team" CASCADE;
  DROP TABLE "projects_team_locales" CASCADE;`)
}
