import { PrismaClient } from '@prisma/client';
import prisma from '../config/database';
import { 
  CreateAccountInput,
  DepositInput,
  WithdrawInput,
  TransferInput,
  StatementInput 
} from '../schemas/account.schemas';
import { 
  AppError, 
  NotFoundError, 
  ValidationError,
  ForbiddenError 
} from '../utils/errors';
import { PaginatedResponse } from '../types';

// Tipo para transação do Prisma
type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export class AccountService {
  // Criar nova conta
  async createAccount(userId: string, data: CreateAccountInput) {
    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Verificar número máximo de contas por usuário (opcional)
    const userAccountsCount = await prisma.account.count({
      where: { userId, isActive: true },
    });

    if (userAccountsCount >= 5) {
      throw new ValidationError('Limite máximo de 5 contas por usuário atingido');
    }

    // Criar conta
    const account = await prisma.account.create({
      data: {
        userId,
        type: data.type,
        balance: data.initialBalance,
      },
      select: {
        id: true,
        accountNumber: true,
        agency: true,
        type: true,
        balance: true,
        createdAt: true,
      },
    });

    return account;
  }

  // Obter detalhes da conta
  async getAccount(userId: string, accountId: string) {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
        isActive: true,
      },
      select: {
        id: true,
        accountNumber: true,
        agency: true,
        type: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!account) {
      throw new NotFoundError('Conta não encontrada');
    }

    return account;
  }

  // Realizar depósito
  async deposit(userId: string, accountId: string, data: DepositInput) {
    return await prisma.$transaction(async (tx: PrismaTransaction) => {
      // Buscar conta com lock para evitar race conditions
      const account = await tx.account.findFirst({
        where: {
          id: accountId,
          userId,
          isActive: true,
        },
        select: {
          id: true,
          balance: true,
        },
      });

      if (!account) {
        throw new NotFoundError('Conta não encontrada');
      }

      // Atualizar saldo
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: data.amount,
          },
        },
        select: {
          id: true,
          accountNumber: true,
          balance: true,
        },
      });

      // Registrar transação
      await tx.transaction.create({
        data: {
          fromAccountId: accountId,
          toAccountId: accountId, // Self-transfer para depósito
          type: 'DEPOSIT',
          amount: data.amount,
          description: data.description || 'Depósito',
        },
      });

      return updatedAccount;
    });
  }

  // Realizar saque
  async withdraw(userId: string, accountId: string, data: WithdrawInput) {
    return await prisma.$transaction(async (tx: PrismaTransaction) => {
      const account = await tx.account.findFirst({
        where: {
          id: accountId,
          userId,
          isActive: true,
        },
        select: {
          id: true,
          balance: true,
        },
      });

      if (!account) {
        throw new NotFoundError('Conta não encontrada');
      }

      // Verificar saldo suficiente
      if (account.balance < data.amount) {
        throw new ValidationError('Saldo insuficiente');
      }

      // Atualizar saldo
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: data.amount,
          },
        },
        select: {
          id: true,
          accountNumber: true,
          balance: true,
        },
      });

      // Registrar transação
      await tx.transaction.create({
        data: {
          fromAccountId: accountId,
          toAccountId: accountId, // Self-transfer para saque
          type: 'WITHDRAWAL',
          amount: data.amount,
          description: 'Saque',
        },
      });

      return updatedAccount;
    });
  }

  // Realizar transferência
  async transfer(userId: string, fromAccountId: string, data: TransferInput) {
    return await prisma.$transaction(async (tx: PrismaTransaction) => {
      // Verificar conta de origem
      const fromAccount = await tx.account.findFirst({
        where: {
          id: fromAccountId,
          userId,
          isActive: true,
        },
        select: {
          id: true,
          balance: true,
        },
      });

      if (!fromAccount) {
        throw new NotFoundError('Conta de origem não encontrada');
      }

      // Verificar conta de destino
      const toAccount = await tx.account.findUnique({
        where: {
          id: data.toAccountId,
          isActive: true,
        },
        select: {
          id: true,
          userId: true,
        },
      });

      if (!toAccount) {
        throw new NotFoundError('Conta de destino não encontrada');
      }

      // Não permitir transferência para a mesma conta
      if (fromAccountId === data.toAccountId) {
        throw new ValidationError('Não é possível transferir para a mesma conta');
      }

      // Verificar saldo suficiente
      if (fromAccount.balance < data.amount) {
        throw new ValidationError('Saldo insuficiente');
      }

      // Atualizar saldo da conta de origem
      await tx.account.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: data.amount,
          },
        },
      });

      // Atualizar saldo da conta de destino
      await tx.account.update({
        where: { id: data.toAccountId },
        data: {
          balance: {
            increment: data.amount,
          },
        },
      });

      // Registrar transação
      const transaction = await tx.transaction.create({
        data: {
          fromAccountId,
          toAccountId: data.toAccountId,
          type: 'TRANSFER',
          amount: data.amount,
          description: data.description || 'Transferência',
        },
      });

      return {
        transactionId: transaction.id,
        amount: data.amount,
        fromAccountId,
        toAccountId: data.toAccountId,
        timestamp: transaction.createdAt,
      };
    });
  }

 // Obter extrato
  async getStatement(
    userId: string, 
    accountId: string, 
    filters: StatementInput
  ): Promise<PaginatedResponse<any>> {
    // Verificar se conta pertence ao usuário
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
        isActive: true,
      },
      select: { id: true },
    });

    if (!account) {
      throw new NotFoundError('Conta não encontrada');
    }

    // Construir filtros
    const where: any = {
      OR: [
        { fromAccountId: accountId },
        { toAccountId: accountId },
      ],
    };

    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) {
        where.createdAt.gte = new Date(filters.from);
      }
      if (filters.to) {
        where.createdAt.lte = new Date(filters.to);
      }
    }

    // Calcular paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Buscar transações
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          status: true,
          createdAt: true,
          fromAccountId: true,
          fromAccount: {
            select: {
              accountNumber: true,
              agency: true,
            },
          },
          toAccountId: true,
          toAccount: {
            select: {
              accountNumber: true,
              agency: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    // Calcular metadados de paginação
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Formatar resposta com tipo explícito
    const formattedTransactions = transactions.map((
      transaction: {
        id: string;
        type: string;
        amount: number;
        description: string | null;
        status: string;
        createdAt: Date;
        fromAccountId: string;
        fromAccount: { accountNumber: string; agency: string };
        toAccountId: string;
        toAccount: { accountNumber: string; agency: string };
      }
    ) => ({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status,
      createdAt: transaction.createdAt,
      fromAccount: transaction.fromAccount,
      toAccount: transaction.toAccount,
      isDebit: transaction.fromAccountId === accountId,
    }));

    return {
      data: formattedTransactions,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  // Listar todas as contas do usuário
  async getUserAccounts(userId: string) {
    const accounts = await prisma.account.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        id: true,
        accountNumber: true,
        agency: true,
        type: true,
        balance: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return accounts;
  }
}

export default new AccountService();