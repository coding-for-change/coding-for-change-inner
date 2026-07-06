import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "waitlist_signups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"locale" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "waitlist_signups_id" integer;
  CREATE INDEX "waitlist_signups_updated_at_idx" ON "waitlist_signups" USING btree ("updated_at");
  CREATE INDEX "waitlist_signups_created_at_idx" ON "waitlist_signups" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_waitlist_signups_fk" FOREIGN KEY ("waitlist_signups_id") REFERENCES "public"."waitlist_signups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_waitlist_signups_id_idx" ON "payload_locked_documents_rels" USING btree ("waitlist_signups_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "waitlist_signups" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "waitlist_signups" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_waitlist_signups_fk";
  
  DROP INDEX "payload_locked_documents_rels_waitlist_signups_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "waitlist_signups_id";`)
}
