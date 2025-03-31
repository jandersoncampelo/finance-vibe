// Interface for pending invoices from API

export interface PendingInvoice {
  id: string;
  confidence: number;
  merchant: Merchant;
  items: Product[];
  total: number;
  totalConfidence: number;
  totalTax: number;
  totalTaxConfidence: number;
  transactionDate: string;
  transactionDateConfidence: number;
  isRegistered: boolean;
}

// Define interface for product items
export interface Product {
  code: number;
  codeConfidence: number;
  description: string;
  descriptionConfidence: number;
  price: number;
  priceConfidence: number;
  quantity: number;
  quantityConfidence: number;
  unit: string;
  unitConfidence: number;
  totalPrice: number;
  totalPriceConfidence: number;
  isRegistered: boolean;
}

export interface Merchant {
  name: string;
  nameConfidence: number;
  cnpj: string;
  cnpjConfidence: number;
  address: string;
  addressConfidence: number;
  isRegistered: boolean;
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