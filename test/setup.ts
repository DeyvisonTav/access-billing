import { testDataSource } from '../src/config/typeorm-test.config';

beforeAll(async () => {
  try {
    await testDataSource.initialize();
    console.log('Test database connection established successfully');
  } catch (error) {
    console.error('Failed to initialize test database:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await testDataSource.destroy();
    console.log('Test database connection closed successfully');
  } catch (error) {
    console.error('Failed to close test database connection:', error);
    throw error;
  }
}); 