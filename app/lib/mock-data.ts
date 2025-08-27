
import { User, Group, Expense, Settlement } from './types';

export const mockUsers: User[] = [
  {
    userId: '1',
    farcasterId: 'alice',
    baseWalletAddress: '0x1234567890123456789012345678901234567890',
    displayName: 'Alice Johnson',
    profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d3?w=150&h=150&fit=crop&crop=face',
  },
  {
    userId: '2',
    farcasterId: 'bob',
    baseWalletAddress: '0x2345678901234567890123456789012345678901',
    displayName: 'Bob Smith',
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    userId: '3',
    farcasterId: 'charlie',
    baseWalletAddress: '0x3456789012345678901234567890123456789012',
    displayName: 'Charlie Brown',
    profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
];

export const mockGroups: Group[] = [
  {
    groupId: '1',
    groupName: 'Trip to Europe',
    createdAt: '2024-01-15T10:00:00Z',
    active: true,
    members: mockUsers,
    totalExpenses: 1250.50,
    myBalance: -84.17, // I owe money
  },
  {
    groupId: '2',
    groupName: 'Roommate Expenses',
    createdAt: '2024-01-10T08:30:00Z',
    active: true,
    members: [mockUsers[0], mockUsers[1]],
    totalExpenses: 850.00,
    myBalance: 125.00, // I'm owed money
  },
  {
    groupId: '3',
    groupName: 'Dinner Club',
    createdAt: '2024-01-05T19:15:00Z',
    active: true,
    members: mockUsers,
    totalExpenses: 320.75,
    myBalance: 0, // All settled
  },
];

export const mockExpenses: Expense[] = [
  {
    expenseId: '1',
    groupId: '1',
    description: 'Hotel in Paris',
    amount: 450.00,
    paidByUserId: '2',
    paidByUser: mockUsers[1],
    splitType: 'equal',
    splits: [
      { userId: '1', user: mockUsers[0], amount: 150.00, settled: false },
      { userId: '2', user: mockUsers[1], amount: 150.00, settled: true },
      { userId: '3', user: mockUsers[2], amount: 150.00, settled: false },
    ],
    createdAt: '2024-01-16T14:30:00Z',
    settled: false,
  },
  {
    expenseId: '2',
    groupId: '1',
    description: 'Dinner at restaurant',
    amount: 125.50,
    paidByUserId: '1',
    paidByUser: mockUsers[0],
    splitType: 'equal',
    splits: [
      { userId: '1', user: mockUsers[0], amount: 41.83, settled: true },
      { userId: '2', user: mockUsers[1], amount: 41.83, settled: true },
      { userId: '3', user: mockUsers[2], amount: 41.84, settled: false },
    ],
    createdAt: '2024-01-17T20:15:00Z',
    settled: false,
  },
  {
    expenseId: '3',
    groupId: '2',
    description: 'Groceries',
    amount: 85.25,
    paidByUserId: '1',
    paidByUser: mockUsers[0],
    splitType: 'equal',
    splits: [
      { userId: '1', user: mockUsers[0], amount: 42.62, settled: true },
      { userId: '2', user: mockUsers[1], amount: 42.63, settled: false },
    ],
    createdAt: '2024-01-18T11:00:00Z',
    settled: false,
  },
];

export const mockSettlements: Settlement[] = [
  {
    settlementId: '1',
    groupId: '1',
    fromUserId: '3',
    fromUser: mockUsers[2],
    toUserId: '1',
    toUser: mockUsers[0],
    amount: 41.84,
    status: 'completed',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    createdAt: '2024-01-18T15:30:00Z',
  },
  {
    settlementId: '2',
    groupId: '2',
    fromUserId: '2',
    fromUser: mockUsers[1],
    toUserId: '1',
    toUser: mockUsers[0],
    amount: 42.63,
    status: 'pending',
    createdAt: '2024-01-18T16:00:00Z',
  },
];

// Current user for mock purposes
export const currentUser = mockUsers[0];
