import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_blocks_demo" ALTER COLUMN "video_id" SET NOT NULL;
  ALTER TABLE "projects_blocks_demo" DROP COLUMN "embed_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_blocks_demo" ALTER COLUMN "video_id" DROP NOT NULL;
  ALTER TABLE "projects_blocks_demo" ADD COLUMN "embed_url" varchar;`)
}
