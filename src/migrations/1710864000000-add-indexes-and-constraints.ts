import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesAndConstraints1710864000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_lotes_nome ON lotes(nome);
      CREATE INDEX IF NOT EXISTS idx_lotes_ativo ON lotes(ativo);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_boletos_id_lote ON boletos(id_lote);
      CREATE INDEX IF NOT EXISTS idx_boletos_nome_sacado ON boletos(nome_sacado);
      CREATE INDEX IF NOT EXISTS idx_boletos_valor ON boletos(valor);
      CREATE INDEX IF NOT EXISTS idx_boletos_ativo ON boletos(ativo);
    `);

    await queryRunner.query(`
      ALTER TABLE boletos
      ADD CONSTRAINT fk_boletos_lotes
      FOREIGN KEY (id_lote)
      REFERENCES lotes(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE boletos
      DROP CONSTRAINT IF EXISTS fk_boletos_lotes;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_boletos_id_lote;
      DROP INDEX IF EXISTS idx_boletos_nome_sacado;
      DROP INDEX IF EXISTS idx_boletos_valor;
      DROP INDEX IF EXISTS idx_boletos_ativo;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_lotes_nome;
      DROP INDEX IF EXISTS idx_lotes_ativo;
    `);
  }
} 