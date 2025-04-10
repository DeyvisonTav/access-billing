import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1710864000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS lotes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        ativo BOOLEAN NOT NULL DEFAULT true,
        criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS boletos (
        id SERIAL PRIMARY KEY,
        nome_sacado VARCHAR(255) NOT NULL,
        id_lote INTEGER NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        linha_digitavel VARCHAR(255) NOT NULL,
        ativo BOOLEAN NOT NULL DEFAULT true,
        criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS boletos;
      DROP TABLE IF EXISTS lotes;
    `);
  }
} 