import accountService from '../../src/services/account.service';
import { NotFoundError, ValidationError } from '../../src/utils/errors';
import prisma from '../../src/config/database';

// Mock do Prisma
jest.mock('../../src/config/database', () => {
  const mockTransaction = {
    account: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
  };

  return {
    account: mockTransaction.account,
    transaction: mockTransaction.transaction,
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockTransaction)),
    $disconnect: jest.fn(),
  };
});

describe('AccountService Unit Tests', () => {
  const userId = 'user-123';
  const accountId = 'account-123';
  const anotherAccountId = 'account-456';

  const mockAccount = {
    id: accountId,
    userId,
    accountNumber: 'ACC123456',
    agency: '0001',
    type: 'CHECKING',
    balance: 1000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create a new account successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.account.count as jest.Mock).mockResolvedValue(0);
      (prisma.account.create as jest.Mock).mockResolvedValue({
        ...mockAccount,
        balance: 1500,
      });

      const result = await accountService.createAccount(userId, {
        type: 'CHECKING',
        initialBalance: 1500,
      });

      expect(result).toMatchObject({
        id: accountId,
        type: 'CHECKING',
        balance: 1500,
      });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        accountService.createAccount('non-existent-user', {
          type: 'CHECKING',
          initialBalance: 1000,
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError for account limit reached', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.account.count as jest.Mock).mockResolvedValue(5);

      await expect(
        accountService.createAccount(userId, {
          type: 'CHECKING',
          initialBalance: 1000,
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getAccount', () => {
    it('should return account details', async () => {
      (prisma.account.findFirst as jest.Mock).mockResolvedValue(mockAccount);

      const result = await accountService.getAccount(userId, accountId);

      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundError for non-existent account', async () => {
      (prisma.account.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        accountService.getAccount(userId, 'non-existent-account')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deposit', () => {
    it('should deposit successfully', async () => {
      const mockTx = {
        account: {
          findFirst: jest.fn().mockResolvedValue(mockAccount),
          update: jest.fn().mockResolvedValue({
            ...mockAccount,
            balance: mockAccount.balance + 500,
          }),
        },
        transaction: {
          create: jest.fn().mockResolvedValue({}),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(mockTx)
      );

      const result = await accountService.deposit(userId, accountId, {
        amount: 500,
        description: 'Test deposit',
      });

      expect(result.balance).toBe(1500);
      expect(mockTx.transaction.create).toHaveBeenCalledWith({
        data: {
          fromAccountId: accountId,
          toAccountId: accountId,
          type: 'DEPOSIT',
          amount: 500,
          description: 'Test deposit',
        },
      });
    });
  });

  describe('withdraw', () => {
    it('should withdraw successfully', async () => {
      const mockTx = {
        account: {
          findFirst: jest.fn().mockResolvedValue(mockAccount),
          update: jest.fn().mockResolvedValue({
            ...mockAccount,
            balance: mockAccount.balance - 200,
          }),
        },
        transaction: {
          create: jest.fn().mockResolvedValue({}),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(mockTx)
      );

      const result = await accountService.withdraw(userId, accountId, {
        amount: 200,
      });

      expect(result.balance).toBe(800);
    });

    it('should throw ValidationError for insufficient balance', async () => {
      const mockTx = {
        account: {
          findFirst: jest.fn().mockResolvedValue(mockAccount),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => callback(mockTx)
      );

      await expect(
        accountService.withdraw(userId, accountId, {
          amount: 2000,
        })
      ).rejects.toThrow(ValidationError);
    });
  });
});