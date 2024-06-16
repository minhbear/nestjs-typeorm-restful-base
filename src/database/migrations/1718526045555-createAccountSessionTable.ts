import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountSessionTable1718526045555
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "account_session" (
            "id"                serial                      NOT NULL,
            "account_id"        bigint                      NOT NULL,
            "created_at"        timestamp with time zone    NOT NULL,
            "updated_at"        timestamp with time zone    NOT NULL,

            CONSTRAINT "pk_account_session" PRIMARY KEY ("id"),
            CONSTRAINT "fk_account_session_account" FOREIGN KEY ("account_id") REFERENCES "account" ("id") 
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "account_session"; 
    `);
  }
}
