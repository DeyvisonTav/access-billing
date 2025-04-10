import { join } from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente
config();

// Define o diretório raiz do projeto para os testes
process.env.APP_ROOT_PATH = join(__dirname, '..');

// Configurações adicionais do ambiente de teste
process.env.NODE_ENV = 'test';

// Configuração do DataSource para testes
export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'docker',
  password: process.env.DB_PASSWORD || 'docker',
  database: process.env.DB_NAME || 'access-billing-test',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: true,
});

// Configuração global do Jest
jest.setTimeout(30000);

// Inicializa o banco de dados antes de todos os testes
beforeAll(async () => {
  await testDataSource.initialize();
});

// Fecha a conexão com o banco após todos os testes
afterAll(async () => {
  await testDataSource.destroy();
}); 