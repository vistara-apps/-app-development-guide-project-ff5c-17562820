
import { User, Group, Expense, Settlement } from "../types";

export const mockUsers: User[] = [
  {
    userId: "1",
    farcasterId: "alice.eth",
    baseWalletAddress: "0x1234567890123456789012345678901234567890",
    displayName: "Alice Johnson",
    profilePictureUrl: undefined,
  },
  {
    userId: "2",
    farcasterId: "bob.eth",
    baseWalletAddress: "0x2345678901234567890123456789012345678901",
    displayName: "Bob Smith",
    profilePictureUrl: undefined,
  },
  {
    userId: "3",
    farcasterId: "charlie.eth",
    baseWalletAddress: "0x3456789012345678901234567890123456789012",
    displayName: "Charlie Brown",
    profilePictureUrl: undefined,
  },
  {
    userId: "4",
    farcasterId: "diana.eth",
    baseWalletAddress: "0x4567890123456789012345678901234567890123",
    displayName: "Diana Prince",
    profilePictureUrl: undefined,
  }
];

export const mockGroups: Group[] = [
  {
    groupId: "group1",
    groupName: "Weekend Trip",
    createdAt: new Date("2024-01-15"),
    active: true,
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
  },
  {
    groupId: "group2",
    groupName: "Apartment Roommates",
    createdAt: new Date("2024-01-10"),
    active: true,
    members: [mockUsers[0], mockUsers[3]],
  },
  {
    groupId: "group3",
    groupName: "Dinner Club",
    createdAt: new Date("2024-01-20"),
    active: true,
    members: mockUsers,
  }
];

export const mockExpenses: Expense[] = [
  {
    expenseId: "exp1",
    groupId: "group1",
    description: "Hotel Booking",
    amount: 240.00,
    paidByUserId: "1",
    splitType: "equal",
    createdAt: new Date("2024-01-16"),
    settled: false,
    splits: [
      { userId: "1", amount: 80.00 },
      { userId: "2", amount: 80.00 },
      { userId: "3", amount: 80.00 },
    ]
  },
  {
    expenseId: "exp2",
    groupId: "group1",
    description: "Gas for Road Trip",
    amount: 60.00,
    paidByUserId: "2",
    splitType: "equal",
    createdAt: new Date("2024-01-17"),
    settled: false,
    splits: [
      { userId: "1", amount: 20.00 },
      { userId: "2", amount: 20.00 },
      { userId: "3", amount: 20.00 },
    ]
  },
  {
    expenseId: "exp3",
    groupId: "group2",
    description: "Internet Bill",
    amount: 89.99,
    paidByUserId: "4",
    splitType: "equal",
    createdAt: new Date("2024-01-18"),
    settled: false,
    splits: [
      { userId: "1", amount: 44.995 },
      { userId: "4", amount: 44.995 },
    ]
  }
];

export const currentUser = mockUsers[0];
