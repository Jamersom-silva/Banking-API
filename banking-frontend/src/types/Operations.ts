export interface AmountPayload {
  amount: number;
}

export interface TransferPayload {
  toAccountId: string;
  amount: number;
}
