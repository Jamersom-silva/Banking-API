import prisma from '../config/database';
import transactionService from './transaction.service';
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
  ValidationError 
} from '../utils/errors';
import { PaginatedResponse } from '../types';

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

  // ✅ ATUALIZADO: Depósito usando TransactionService
  async deposit(userId: string, accountId: string, data: DepositInput) {
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

    // Usar TransactionService para criar depósito
    const transaction = await transactionService.deposit(
      accountId,
      data.amount,
      data.description || 'Depósito'
    );

    // Buscar saldo atualizado
    const updatedAccount = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        accountNumber: true,
        balance: true,
      },
    });

    return {
      ...updatedAccount,
      transactionId: transaction.id,
      previousBalance: transaction.previousBalance,
      newBalance: transaction.newBalance,
    };
  }

  // ✅ ATUALIZADO: Saque usando TransactionService
  async withdraw(userId: string, accountId: string, data: WithdrawInput) {
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

    const transaction = await transactionService.withdraw(
      accountId,
      data.amount,
      'Saque'
    );

    const updatedAccount = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        accountNumber: true,
        balance: true,
      },
    });

    return {
      ...updatedAccount,
      transactionId: transaction.id,
      previousBalance: transaction.previousBalance,
      newBalance: transaction.newBalance,
    };
  }

  // ✅ ATUALIZADO: Transferência usando TransactionService
  async transfer(userId: string, fromAccountId: string, data: TransferInput) {
    // Verificar se conta de origem pertence ao usuário
    const fromAccount = await prisma.account.findFirst({
      where: {
        id: fromAccountId,
        userId,
        isActive: true,
      },
      select: { id: true },
    });

    if (!fromAccount) {
      throw new NotFoundError('Conta de origem não encontrada');
    }

    // Verificar conta de destino existe
    const toAccount = await prisma.account.findUnique({
      where: {
        id: data.toAccountId,
        isActive: true,
      },
      select: { id: true },
    });

    if (!toAccount) {
      throw new NotFoundError('Conta de destino não encontrada');
    }

    // Não permitir transferência para a mesma conta
    if (fromAccountId === data.toAccountId) {
      throw new ValidationError('Não é possível transferir para a mesma conta');
    }

    const transaction = await transactionService.transfer(
      fromAccountId,
      data.toAccountId,
      data.amount,
      data.description || 'Transferência'
    );

    return {
      transactionId: transaction.id,
      amount: data.amount,
      fromAccountId,
      toAccountId: data.toAccountId,
      fromAccountNewBalance: transaction.accountBalanceChanged.fromAccount?.new,
      toAccountNewBalance: transaction.accountBalanceChanged.toAccount?.new,
      timestamp: transaction.createdAt,
    };
  }

  // ✅ MELHORADO: Extrato com mais informações
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

    // Usar TransactionService para buscar transações
    const result = await transactionService.getTransactions({
      accountId,
      fromDate: filters.from ? new Date(filters.from) : undefined,
      toDate: filters.to ? new Date(filters.to) : undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    });

    return result;
  }

  // ✅ NOVO: Verificar consistência do saldo
  async verifyBalance(accountId: string, userId: string) {
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

    return transactionService.verifyBalanceConsistency(accountId);
  }

  // ✅ NOVO: Obter saldo atual
  async getCurrentBalance(accountId: string, userId: string) {
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

    const balance = await transactionService.getCurrentBalance(accountId);
    
    return {
      accountId,
      balance,
      lastUpdated: new Date().toISOString(),
    };
  }

  // ✅ NOVO: Aplicar taxa à conta
  async applyFee(accountId: string, userId: string, amount: number, description: string) {
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

    const transaction = await transactionService.applyFee(
      accountId,
      amount,
      description
    );

    return {
      transactionId: transaction.id,
      feeAmount: amount,
      newBalance: transaction.newBalance,
      description: transaction.description,
    };
  }

  // ✅ NOVO: Aplicar juros à conta
  async applyInterest(accountId: string, userId: string, amount: number, description?: string) {
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

    const transaction = await transactionService.applyInterest(
      accountId,
      amount,
      description || 'Juros aplicados'
    );

    return {
      transactionId: transaction.id,
      interestAmount: amount,
      newBalance: transaction.newBalance,
      description: transaction.description,
    };
  }

  // ✅ NOVO: Fazer pagamento
  async makePayment(accountId: string, userId: string, amount: number, description: string) {
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

    const transaction = await transactionService.makePayment(
      accountId,
      amount,
      description
    );

    return {
      transactionId: transaction.id,
      paymentAmount: amount,
      newBalance: transaction.newBalance,
      description: transaction.description,
    };
  }

  // ✅ NOVO: Reverter transação
  async reverseTransaction(transactionId: string, userId: string, reason?: string) {
    // Primeiro verificar se o usuário tem acesso à transação
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        OR: [
          { fromAccount: { userId } },
          { toAccount: { userId } },
        ],
      },
      include: {
        fromAccount: { select: { userId: true } },
        toAccount: { select: { userId: true } },
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transação não encontrada ou acesso negado');
    }

    const reversedTransaction = await transactionService.reverseTransaction(
      transactionId,
      reason
    );

    return {
      originalTransactionId: transactionId,
      reversalTransactionId: reversedTransaction.id,
      amount: reversedTransaction.amount,
      reason: reversedTransaction.description,
      timestamp: reversedTransaction.createdAt,
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