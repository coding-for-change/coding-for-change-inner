import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  
  ALTER TABLE "projects_locales" ADD COLUMN "impact_headline" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "impact_challenge" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "impact_solution" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "impact_results" varchar;
  ALTER TABLE "projects_ngo_faq" ADD CONSTRAINT "projects_ngo_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_ngo_faq_locales" ADD CONSTRAINT "projects_ngo_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_ngo_faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_ngo_faq_order_idx" ON "projects_ngo_faq" USING btree ("_order");
  CREATE INDEX "projects_ngo_faq_parent_id_idx" ON "projects_ngo_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_ngo_faq_locales_locale_parent_id_unique" ON "projects_ngo_faq_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_ngo_faq" CASCADE;
  DROP TABLE "projects_ngo_faq_locales" CASCADE;
  ALTER TABLE "projects_locales" DROP COLUMN "impact_headline";
  ALTER TABLE "projects_locales" DROP COLUMN "impact_challenge";
  ALTER TABLE "projects_locales" DROP COLUMN "impact_solution";
  ALTER TABLE "projects_locales" DROP COLUMN "impact_results";`)
}
