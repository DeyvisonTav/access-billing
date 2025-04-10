import { testDataSource } from '../src/config/typeorm-test.config';

beforeAll(async () => {
  await testDataSource.initialize();
});

afterAll(async () => {
  await testDataSource.destroy();
}); 