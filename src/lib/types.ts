// Interface for pending invoices from API

export interface PendingInvoice {
  id: string;
  confidence?: number | null;
  merchant?: Merchant | null;
  items?: Product[] | null;
  total?: number | null;
  totalConfidence?: number | null;
  totalTax?: number | null;
  totalTaxConfidence?: number | null;
  transactionDate?: string | null;
  transactionDateConfidence?: number | null;
  isRegistered?: boolean | null;
}

// Define interface for product items
export interface Product {
  code?: number | null;
  codeConfidence?: number | null;
  description?: string | null;
  descriptionConfidence?: number | null;
  price?: number | null;
  priceConfidence?: number | null;
  quantity?: number | null;
  quantityConfidence?: number | null;
  unit?: string | null;
  unitConfidence?: number | null;
  totalPrice?: number | null;
  totalPriceConfidence?: number | null;
  isRegistered?: boolean | null;
}

export interface Merchant {
  name?: string | null;
  nameConfidence?: number | null;
  cnpj?: string | null;
  cnpjConfidence?: number | null;
  address?: string | null;
  addressConfidence?: number | null;
  isRegistered?: boolean | null;
}

export interface PendingInvoicesResponse {
  results: PendingInvoice[];
  continuationToken?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  reference?: string;
}

export interface DashboardSummary {
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  pendingInvoices: number;
  pendingAmount: number;
  recentTransactions: Transaction[];
}