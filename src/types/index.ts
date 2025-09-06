export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Owner {
  user: User;
  percentage: number;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  isRecurring: boolean;
  recurringPeriod?: 'monthly' | 'yearly';
  date: Date;
  paidBy?: string; // user id
  documents?: Document[]; // attached receipts/documents
}

export interface Booking {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  status: 'confirmed' | 'pending';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  value: number; // in USD
  owners: Owner[];
  recurringBills: Bill[];
  oneTimeBills: Bill[];
  bookings: Booking[];
  documents: Document[];
  createdBy: string;
  createdAt: Date;
  imageUrl?: string;
}

export interface DashboardStats {
  totalItems: number;
  totalValue: number;
  monthlyExpenses: number;
  upcomingBookings: number;
}