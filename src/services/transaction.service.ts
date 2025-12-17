import { PrismaClient } from '@prisma/client';
import prisma from '../config/database';
import { 
  AppError, 
  ValidationError,
  NotFoundError 
} from '../utils/errors';

export interface CreateTransactionInput {
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FEE' | 'INTEREST' | 'PAYMENT' | 'REVERSAL' | 'ADJUSTMENT';
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  description?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

export interface TransactionResult {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  status: string;
  createdAt: Date;
  fromAccountId: string | null;
  toAccountId: string | null;
  previousBalance: number | null;  // ADICIONADO
  newBalance: number | null;       // ADICIONADO
  accountBalanceChanged: {
    fromAccount: {
      previous: number;
      new: number;
    } | null;
    toAccount: {
      previous: number;
      new: number;
    } | null;
  };
}

export class TransactionService {
  // Criar transação genérica
  async createTransaction(data: CreateTransactionInput): Promise<TransactionResult> {
    return await prisma.$transaction(async (tx) => {
      let fromAccount = null;
      let toAccount = null;
      let previousBalanceFrom = 0;
      let previousBalanceTo = 0;
      let newBalanceFrom = 0;
      let newBalanceTo = 0;

      // Buscar contas se necessário
      if (data.fromAccountId) {
        fromAccount = await tx.account.findUnique({
          where: { id: data.fromAccountId },
          select: { id: true, balance: true, isActive: true },
        });

        if (!fromAccount) {
          throw new NotFoundError('Conta de origem não encontrada');
        }
        if (!fromAccount.isActive) {
          throw new ValidationError('Conta de origem desativada');
        }

        previousBalanceFrom = fromAccount.balance;
        
        // Atualizar saldo se for débito
        if (['WITHDRAWAL', 'TRANSFER', 'FEE', 'PAYMENT'].includes(data.type)) {
          if (fromAccount.balance < data.amount && data.type !== 'ADJUSTMENT') {
            throw new ValidationError('Saldo insuficiente');
          }
          
          newBalanceFrom = fromAccount.balance - data.amount;
          await tx.account.update({
            where: { id: data.fromAccountId },
            data: { balance: newBalanceFrom },
          });
        } else {
          newBalanceFrom = fromAccount.balance;
        }
      }

      if (data.toAccountId) {
        toAccount = await tx.account.findUnique({
          where: { id: data.toAccountId },
          select: { id: true, balance: true, isActive: true },
        });

        if (!toAccount) {
          throw new NotFoundError('Conta de destino não encontrada');
        }
        if (!toAccount.isActive) {
          throw new ValidationError('Conta de destino desativada');
        }

        previousBalanceTo = toAccount.balance;
        
        // Atualizar saldo se for crédito
        if (['DEPOSIT', 'TRANSFER', 'INTEREST', 'REVERSAL'].includes(data.type)) {
          newBalanceTo = toAccount.balance + data.amount;
          await tx.account.update({
            where: { id: data.toAccountId },
            data: { balance: newBalanceTo },
          });
        } else {
          newBalanceTo = toAccount.balance;
        }
      }

      // Determinar previousBalance e newBalance para a transação
      const previousBalance = fromAccount ? previousBalanceFrom : previousBalanceTo;
      const newBalance = fromAccount ? newBalanceFrom : newBalanceTo;

      // Criar registro da transação
      const transaction = await tx.transaction.create({
        data: {
          type: data.type,
          fromAccountId: data.fromAccountId,
          toAccountId: data.toAccountId,
          amount: data.amount,
          description: data.description,
          status: data.status || 'COMPLETED',
          previousBalance,  // Salvo no banco
          newBalance,       // Salvo no banco
        },
      });

      return {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        status: transaction.status,
        createdAt: transaction.createdAt,
        fromAccountId: transaction.fromAccountId,
        toAccountId: transaction.toAccountId,
        previousBalance: transaction.previousBalance,  // Agora disponível
        newBalance: transaction.newBalance,            // Agora disponível
        accountBalanceChanged: {
          fromAccount: fromAccount ? {
            previous: previousBalanceFrom,
            new: newBalanceFrom,
          } : null,
          toAccount: toAccount ? {
            previous: previousBalanceTo,
            new: newBalanceTo,
          } : null,
        },
      };
    });
  }

  // Métodos específicos
  async deposit(toAccountId: string, amount: number, description?: string): Promise<TransactionResult> {
    return this.createTransaction({
      type: 'DEPOSIT',
      toAccountId,
      amount,
      description: description || 'Depósito',
    });
  }

  async withdraw(fromAccountId: string, amount: number, description?: string): Promise<TransactionResult> {
    return this.createTransaction({
      type: 'WITHDRAWAL',
      fromAccountId,
      amount,
      description: description || 'Saque',
    });
  }

  async transfer(fromAccountId: string, toAccountId: string, amount: number, description?: string): Promise<TransactionResult> {
    return this.createTransaction({
      type: 'TRANSFER',
      fromAccountId,
      toAccountId,
      amount,
      description: description || 'Transferência',
    });
  }

  async applyFee(accountId: string, amount: number, description: string): Promise<TransactionResult> {
    return this.createTransaction({
      type: 'FEE',
      fromAccountId: accountId,
      amount,
      description,
    });
  }

  async applyInterest(accountId: string, amount: number, description?: string): Promise<TransactionResult> {
    return this.createTransaction({
      type: 'INTEREST',
      toAccountId: accountId,
      amount,
      description: description || 'Juros',
    });
  }

  async makePayment(fromAccountId: string, amount: number, description: string): Promise<TransactionResult> {
    return this.createTransaction({
      type: 'PAYMENT',
      fromAccountId,
      amount,
      description,
    });
  }

  async reverseTransaction(transactionId: string, reason?: string): Promise<TransactionResult> {
    const originalTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        fromAccount: { select: { id: true } },
        toAccount: { select: { id: true } },
      },
    });

    if (!originalTransaction) {
      throw new NotFoundError('Transação não encontrada');
    }

    return this.createTransaction({
      type: 'REVERSAL',
      fromAccountId: originalTransaction.toAccountId || undefined,
      toAccountId: originalTransaction.fromAccountId || undefined,
      amount: originalTransaction.amount,
      description: `Estorno: ${originalTransaction.description || ''} - ${reason || 'Solicitado'}`,
    });
  }

  // Consultar transações
  async getTransactions(filters: {
    accountId?: string;
    type?: string;
    status?: string;
    fromDate?: Date;
    toDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (filters.accountId) {
      where.OR = [
        { fromAccountId: filters.accountId },
        { toAccountId: filters.accountId },
      ];
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) {
        where.createdAt.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.createdAt.lte = filters.toDate;
      }
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) {
        where.amount.gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        where.amount.lte = filters.maxAmount;
      }
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          fromAccount: {
            select: {
              id: true,
              accountNumber: true,
              agency: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          toAccount: {
            select: {
              id: true,
              accountNumber: true,
              agency: true,
              user: {
                select: {
                  name: true,
                },
              },
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

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Formatar resposta
    const formattedTransactions = transactions.map(transaction => {
      const isDebit = transaction.fromAccountId === filters.accountId;
      
      return {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        status: transaction.status,
        createdAt: transaction.createdAt,
        previousBalance: transaction.previousBalance,
        newBalance: transaction.newBalance,
        fromAccount: transaction.fromAccount,
        toAccount: transaction.toAccount,
        isDebit,
        counterpart: isDebit ? transaction.toAccount : transaction.fromAccount,
        amountFormatted: `R$ ${transaction.amount.toFixed(2)}`,
        previousBalanceFormatted: transaction.previousBalance ? `R$ ${transaction.previousBalance.toFixed(2)}` : null,
        newBalanceFormatted: transaction.newBalance ? `R$ ${transaction.newBalance.toFixed(2)}` : null,
        balanceChange: transaction.newBalance && transaction.previousBalance 
          ? transaction.newBalance - transaction.previousBalance
          : null,
      };
    });

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

  // Obter saldo atual
  async getCurrentBalance(accountId: string): Promise<number> {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: { balance: true },
    });

    if (!account) {
      throw new NotFoundError('Conta não encontrada');
    }

    return account.balance;
  }

  // Verificar consistência do saldo
  async verifyBalanceConsistency(accountId: string): Promise<{
    isConsistent: boolean;
    calculatedBalance: number;
    storedBalance: number;
    difference: number;
  }> {
    // Buscar todas as transações da conta
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ],
        status: 'COMPLETED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calcular saldo a partir do histórico
    let calculatedBalance = 0;
    
    for (const transaction of transactions) {
      if (transaction.fromAccountId === accountId) {
        // Débito
        calculatedBalance -= transaction.amount;
      }
      if (transaction.toAccountId === accountId) {
        // Crédito
        calculatedBalance += transaction.amount;
      }
    }

    // Buscar saldo armazenado
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: { balance: true },
    });

    if (!account) {
      throw new NotFoundError('Conta não encontrada');
    }

    const storedBalance = account.balance;
    const difference = Math.abs(calculatedBalance - storedBalance);
    const isConsistent = difference < 0.01; // Tolerância de 1 centavo

    return {
      isConsistent,
      calculatedBalance,
      storedBalance,
      difference,
    };
  }
}

export default new TransactionService();