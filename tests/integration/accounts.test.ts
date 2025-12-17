import request from 'supertest';
import app from '../../src/index';
import { testPrisma, cleanupDatabase, testUser, testAccount } from '../setup';

describe('Accounts Integration Tests', () => {
  let authToken: string;
  let accountId: string;

  beforeAll(async () => {
    await cleanupDatabase();
    
    // Criar usuário para teste
    await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    // Fazer login para obter token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  describe('POST /api/v1/accounts', () => {
    it('should create a new account successfully', async () => {
      const response = await request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testAccount)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Conta criada com sucesso',
        data: {
          id: expect.any(String),
          accountNumber: expect.any(String),
          agency: '0001',
          type: testAccount.type,
          balance: testAccount.initialBalance,
        },
      });

      accountId = response.body.data.id;
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/v1/accounts')
        .send(testAccount)
        .expect(401);
    });
  });

  describe('GET /api/v1/accounts/:id', () => {
    it('should get account details', async () => {
      const response = await request(app)
        .get(`/api/v1/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(accountId);
    });

    it('should return 404 for non-existent account', async () => {
      await request(app)
        .get('/api/v1/accounts/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('POST /api/v1/accounts/:id/deposit', () => {
    it('should deposit successfully', async () => {
      const depositAmount = 500;
      
      const response = await request(app)
        .post(`/api/v1/accounts/${accountId}/deposit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: depositAmount, description: 'Test deposit' })
        .expect(200);

      expect(response.body.data.balance).toBe(testAccount.initialBalance + depositAmount);
    });

    it('should validate deposit amount', async () => {
      await request(app)
        .post(`/api/v1/accounts/${accountId}/deposit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: -100 })
        .expect(400);
    });
  });

  describe('POST /api/v1/accounts/:id/withdraw', () => {
    it('should withdraw successfully', async () => {
      const withdrawAmount = 200;
      
      const response = await request(app)
        .post(`/api/v1/accounts/${accountId}/withdraw`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: withdrawAmount })
        .expect(200);

      expect(response.body.data.balance).toBeGreaterThan(0);
    });

    it('should return 400 for insufficient balance', async () => {
      await request(app)
        .post(`/api/v1/accounts/${accountId}/withdraw`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 1000000 })
        .expect(400);
    });
  });

  describe('GET /api/v1/accounts/:id/statement', () => {
    it('should get account statement', async () => {
      const response = await request(app)
        .get(`/api/v1/accounts/${accountId}/statement?page=1&limit=10`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
        meta: {
          total: expect.any(Number),
          page: 1,
          limit: 10,
        },
      });
    });
  });
});