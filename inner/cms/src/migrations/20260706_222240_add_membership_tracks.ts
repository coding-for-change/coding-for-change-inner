import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "membership_tracks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "membership_tracks_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "membership_tracks" ADD CONSTRAINT "membership_tracks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_tracks_locales" ADD CONSTRAINT "membership_tracks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_tracks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "membership_tracks_order_idx" ON "membership_tracks" USING btree ("_order");
  CREATE INDEX "membership_tracks_parent_id_idx" ON "membership_tracks" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "membership_tracks_locales_locale_parent_id_unique" ON "membership_tracks_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "membership_tracks" CASCADE;
  DROP TABLE "membership_tracks_locales" CASCADE;`)
}
