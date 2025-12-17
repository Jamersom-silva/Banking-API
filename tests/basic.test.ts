import { testPrisma, cleanupDatabase } from './setup';

describe('Test Setup', () => {
  beforeAll(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it('should connect to test database', async () => {
    // Testar conexão com banco
    await expect(testPrisma.$queryRaw`SELECT 1`).resolves.not.toThrow();
  });

  it('should clean up database', async () => {
    // Verificar que não há usuários
    const users = await testPrisma.user.findMany();
    expect(users).toHaveLength(0);
  });
});