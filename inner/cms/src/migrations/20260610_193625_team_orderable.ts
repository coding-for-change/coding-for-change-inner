import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team" ADD COLUMN "_order" varchar;
  CREATE INDEX "team__order_idx" ON "team" USING btree ("_order");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "team__order_idx";
  ALTER TABLE "team" DROP COLUMN "_order";`)
}
