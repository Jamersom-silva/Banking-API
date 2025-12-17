export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export interface BankTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
}
