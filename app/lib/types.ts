export interface User {
  userId: string;
  farcasterId?: string;
  baseWalletAddress: string;
  displayName: string;
  profilePictureUrl?: string;
}

export interface Group {
  groupId: string;
  groupName: string;
  createdAt: string;
  active: boolean;
  members: User[];
  totalExpenses: number;
  myBalance: number;
}

export interface Expense {
  expenseId: string;
  groupId: string;
  description: string;
  amount: number;
  paidByUserId: string;
  paidByUser: User;
  splitType: 'equal' | 'custom';
  splits: ExpenseSplit[];
  createdAt: string;
  settled: boolean;
}

export interface ExpenseSplit {
  userId: string;
  user: User;
  amount: number;
  settled: boolean;
}

export type PaymentStatus = 
  | 'initial' 
  | 'approving' 
  | 'approved' 
  | 'paying' 
  | 'completed' 
  | 'failed';

export interface Settlement {
  settlementId: string;
  groupId: string;
  fromUserId: string;
  fromUser: User;
  toUserId: string;
  toUser: User;
  amount: number;
  status: PaymentStatus;
  approvalTxHash?: string;
  paymentTxHash?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt?: string;
  expenseId?: string;
}

export interface GroupBalance {
  userId: string;
  user: User;
  balance: number; // positive = owed money, negative = owes money
}
