import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountTable1718523794711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "account" (
            "id"                serial                      NOT NULL,
            "wallet_address"    varchar(255)                NOT NULL,
            "created_at"        timestamp with time zone    NOT NULL,
            "updated_at"        timestamp with time zone    NOT NULL,

            CONSTRAINT "pk_account" PRIMARY KEY ("id")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "account";
    `);
  }
}
