import { Transaction } from '../types/Transaction';

export const dashboardData = {
  balance: 1250.5,
  deposits: 3200.0,
  withdrawals: 1950.0,
  availableBalance: 1250.5,
};

export const transactionsData: Transaction[] = [
  { id: 1, type: 'DEPOSIT', amount: 1000, date: '2025-12-15' },
  { id: 2, type: 'WITHDRAW', amount: 500, date: '2025-12-14' },
  { id: 3, type: 'DEPOSIT', amount: 1200, date: '2025-12-10' },
  { id: 4, type: 'WITHDRAW', amount: 450, date: '2025-12-09' },
];
