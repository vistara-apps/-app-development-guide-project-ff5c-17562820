
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
  createdAt: Date;
  active: boolean;
  members: User[];
}

export interface Expense {
  expenseId: string;
  groupId: string;
  description: string;
  amount: number;
  paidByUserId: string;
  splitType: 'equal' | 'custom' | 'percentage';
  createdAt: Date;
  settled: boolean;
  splits: ExpenseSplit[];
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
}

export interface Settlement {
  settlementId: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  createdAt: Date;
}

export interface Balance {
  userId: string;
  amount: number; // positive = owed to user, negative = owes
}
