import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_team_category" AS ENUM('member', 'adviser');
  CREATE TABLE "team_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"companies_id" integer
  );
  
  ALTER TABLE "team" ADD COLUMN "category" "enum_team_category" DEFAULT 'member' NOT NULL;
  ALTER TABLE "site_config" ADD COLUMN "booking_url" varchar;
  ALTER TABLE "team_rels" ADD CONSTRAINT "team_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_rels" ADD CONSTRAINT "team_rels_companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "team_rels_order_idx" ON "team_rels" USING btree ("order");
  CREATE INDEX "team_rels_parent_idx" ON "team_rels" USING btree ("parent_id");
  CREATE INDEX "team_rels_path_idx" ON "team_rels" USING btree ("path");
  CREATE INDEX "team_rels_companies_id_idx" ON "team_rels" USING btree ("companies_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "team_rels" CASCADE;
  ALTER TABLE "team" DROP COLUMN "category";
  ALTER TABLE "site_config" DROP COLUMN "booking_url";
  DROP TYPE "public"."enum_team_category";`)
}
