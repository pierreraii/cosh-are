import { Item, User, DashboardStats } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "AJ"
  },
  {
    id: "2", 
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "SW"
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@example.com", 
    avatar: "MC"
  }
];

export const mockItems: Item[] = [
  {
    id: "1",
    title: "Tesla Model 3",
    description: "2023 Tesla Model 3 Long Range - Perfect for city commuting and weekend trips",
    value: 45000,
    owners: [
      { user: mockUsers[0], percentage: 50 },
      { user: mockUsers[1], percentage: 50 }
    ],
    recurringBills: [
      {
        id: "b1",
        title: "Insurance",
        amount: 180,
        isRecurring: true,
        recurringPeriod: "monthly",
        date: new Date("2024-01-15"),
        paidBy: "1"
      },
      {
        id: "b2", 
        title: "Car Payment",
        amount: 650,
        isRecurring: true,
        recurringPeriod: "monthly",
        date: new Date("2024-01-01"),
        paidBy: "2"
      }
    ],
    oneTimeBills: [
      {
        id: "b3",
        title: "Tire Replacement",
        amount: 800,
        isRecurring: false,
        date: new Date("2024-01-10"),
        paidBy: "1"
      }
    ],
    bookings: [
      {
        id: "bk1",
        userId: "1",
        startDate: new Date("2024-01-20"),
        endDate: new Date("2024-01-22"),
        title: "Weekend Trip",
        status: "confirmed"
      },
      {
        id: "bk2",
        userId: "2", 
        startDate: new Date("2024-01-25"),
        endDate: new Date("2024-01-25"),
        title: "Grocery Run",
        status: "confirmed"
      }
    ],
    documents: [
      {
        id: "d1",
        name: "Vehicle Registration",
        type: "PDF",
        url: "/docs/registration.pdf",
        uploadedBy: "1",
        uploadedAt: new Date("2024-01-01"),
        size: 245760
      },
      {
        id: "d2",
        name: "Insurance Policy",
        type: "PDF", 
        url: "/docs/insurance.pdf",
        uploadedBy: "2",
        uploadedAt: new Date("2024-01-05"),
        size: 1024000
      }
    ],
    createdBy: "1",
    createdAt: new Date("2024-01-01")
  },
  {
    id: "2",
    title: "Vacation Cabin",
    description: "Cozy mountain cabin in Aspen - 2 bedrooms, fireplace, amazing views",
    value: 320000,
    owners: [
      { user: mockUsers[0], percentage: 40 },
      { user: mockUsers[1], percentage: 35 },
      { user: mockUsers[2], percentage: 25 }
    ],
    recurringBills: [
      {
        id: "b4",
        title: "Property Tax",
        amount: 850,
        isRecurring: true,
        recurringPeriod: "monthly",
        date: new Date("2024-01-01"),
        paidBy: "1"
      },
      {
        id: "b5",
        title: "Utilities",
        amount: 120,
        isRecurring: true,
        recurringPeriod: "monthly", 
        date: new Date("2024-01-01"),
        paidBy: "2"
      }
    ],
    oneTimeBills: [
      {
        id: "b6",
        title: "Roof Repair",
        amount: 2400,
        isRecurring: false,
        date: new Date("2024-01-12"),
        paidBy: "3"
      }
    ],
    bookings: [
      {
        id: "bk3",
        userId: "2",
        startDate: new Date("2024-02-14"),
        endDate: new Date("2024-02-18"),
        title: "Valentine's Getaway",
        status: "confirmed"
      }
    ],
    documents: [
      {
        id: "d3",
        name: "Property Deed",
        type: "PDF",
        url: "/docs/deed.pdf",
        uploadedBy: "1", 
        uploadedAt: new Date("2024-01-01"),
        size: 512000
      }
    ],
    createdBy: "1",
    createdAt: new Date("2023-12-15")
  }
];

export const mockStats: DashboardStats = {
  totalItems: 2,
  totalValue: 365000,
  monthlyExpenses: 1800,
  upcomingBookings: 1
};