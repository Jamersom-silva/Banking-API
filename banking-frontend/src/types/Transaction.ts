export type Transaction = 'deposit' | 'withdrawal' | 'transfer';

export interface TransactionRecord {
    id: number;
    type: Transaction;
    amount: number;
    date: string; // ISO date string
    description?: string;
}
