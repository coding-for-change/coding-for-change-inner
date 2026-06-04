import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_config_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "site_config_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_config_stats" ADD CONSTRAINT "site_config_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_stats_locales" ADD CONSTRAINT "site_config_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config_stats"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_config_stats_order_idx" ON "site_config_stats" USING btree ("_order");
  CREATE INDEX "site_config_stats_parent_id_idx" ON "site_config_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_config_stats_locales_locale_parent_id_unique" ON "site_config_stats_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_config_stats" CASCADE;
  DROP TABLE "site_config_stats_locales" CASCADE;`)
}
