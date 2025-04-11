import { testDataSource } from '../src/config/typeorm-test.config';

beforeAll(async () => {
  try {
   
    await testDataSource.initialize();
    const migrations = await testDataSource.query('SELECT * FROM migrations');
    console.log(migrations);
  } catch (error) {   
    console.error('Falha ao inicializar o banco de dados de teste:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await testDataSource.destroy();
  } catch (error) {
    console.error('Falha ao encerrar a conexão com o banco de dados de teste:', error);
    throw error;
  }
}); 