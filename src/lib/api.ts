// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:44333/api';
import { PendingInvoice, Transaction, DashboardSummary } from './types';

// Transform API response to our expected format
function transformInvoiceResponse(response: any): PendingInvoice[] {
  return response.results.map((item: any) => {
    const content = item.document.content;
    return {
      id: item.document.id,
      confidence: item.document.confidence,
      merchant: {
        name: content.merchant.name.value,
        nameConfidence: content.merchant.name.confidence * 100,
        cnpj: content.merchant.cnpj?.value || '',
        cnpjConfidence: content.merchant.cnpj?.confidence * 100 || 0,
        address: content.merchant.address?.value || '',
        addressConfidence: content.merchant.address?.confidence * 100 || 0,
        isRegistered: false
      },
      items: content.itens.map((item: any) => ({
        code: parseInt(item.code.value.replace(/[^0-9]/g, '')),
        codeConfidence: item.code.confidence * 100,
        description: item.description.value,
        descriptionConfidence: item.description.confidence * 100,
        quantity: item.quantity.value,
        quantityConfidence: item.quantity.confidence * 100,
        price: item.price.value,
        priceConfidence: item.price.confidence * 100,
        unit: item.unit.value,
        unitConfidence: item.unit.confidence * 100,
        totalPrice: item.totalPrice.value,
        totalPriceConfidence: item.totalPrice.confidence * 100,
        isRegistered: false
      })),
      total: content.total.value,
      totalConfidence: content.total.confidence * 100,
      totalTax: content.totalTax?.value || 0,
      totalTaxConfidence: content.totalTax?.confidence * 100 || 0,
      transactionDate: new Date(content.transactionDate.value).toISOString().split('T')[0],
      transactionDateConfidence: content.transactionDate.confidence * 100,
      isRegistered: false
    };
  });
}

// Error handling wrapper for fetch requests
async function fetchWrapper<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Transform the response if it's an invoice endpoint
    if (endpoint.includes('/invoice')) {
      return transformInvoiceResponse(data) as T;
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error - Check if the API server is running and accessible');
    }
    throw error;
  }
}

// Invoice related API calls
export const invoiceApi = {
  getPendingInvoices: () => fetchWrapper<PendingInvoice[]>('/invoice/pendings'),
  getInvoiceById: (id: string) => fetchWrapper<PendingInvoice>(`/invoice/${id}`),
  processInvoice: (id: string) => fetchWrapper<void>(`/invoice/${id}/process`, {
    method: 'POST',
  }),
  rejectInvoice: (id: string, reason: string) => fetchWrapper<void>(`/invoice/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
  getAllInvoices: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWrapper<{ data: PendingInvoice[]; total: number }>(`/invoice${queryString}`);
  }
};

// Supplier related API calls
export const supplierApi = {
  registerSupplier: (supplierData: any) => fetchWrapper<any>('/supplier', {
    method: 'POST',
    body: JSON.stringify(supplierData),
  }),
  searchSuppliers: (query: string) => fetchWrapper<any[]>(`/supplier/search?q=${encodeURIComponent(query)}`),
  getSupplierById: (id: string) => fetchWrapper<any>(`/supplier/${id}`),
  updateSupplier: (id: string, data: any) => fetchWrapper<any>(`/supplier/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getAllSuppliers: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWrapper<{ data: any[]; total: number }>(`/supplier${queryString}`);
  }
};

// Product related API calls
export const productApi = {
  registerProduct: (productData: any) => fetchWrapper<any>('/product', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  searchProducts: (query: string) => fetchWrapper<any[]>(`/product/search?q=${encodeURIComponent(query)}`),
  getProductById: (id: string) => fetchWrapper<any>(`/product/${id}`),
  updateProduct: (id: string, data: any) => fetchWrapper<any>(`/product/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getAllProducts: (params?: { page?: number; limit?: number; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWrapper<{ data: any[]; total: number }>(`/product${queryString}`);
  }
};

// Dashboard and analytics related API calls
export const dashboardApi = {
  getSummary: () => fetchWrapper<DashboardSummary>('/dashboard/summary'),
  getCashFlow: (period: 'week' | 'month' | 'year') => 
    fetchWrapper<any[]>(`/dashboard/cashflow?period=${period}`),
  getExpensesByCategory: () => fetchWrapper<any[]>('/dashboard/expenses/categories'),
  getRecentTransactions: (limit: number = 5) => 
    fetchWrapper<Transaction[]>(`/dashboard/transactions/recent?limit=${limit}`),
};

// Transactions related API calls
export const transactionApi = {
  getAll: (params?: { page?: number; limit?: number; type?: string; dateFrom?: string; dateTo?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWrapper<{ data: Transaction[]; total: number }>(`/transaction${queryString}`);
  },
  create: (transactionData: Omit<Transaction, 'id'>) => fetchWrapper<Transaction>('/transaction', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  }),
  getById: (id: string) => fetchWrapper<Transaction>(`/transaction/${id}`),
  update: (id: string, data: Partial<Transaction>) => fetchWrapper<Transaction>(`/transaction/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchWrapper<void>(`/transaction/${id}`, {
    method: 'DELETE',
  }),
};

// Export a default API object with all services
const api = {
  invoice: invoiceApi,
  supplier: supplierApi,
  product: productApi,
  dashboard: dashboardApi,
  transaction: transactionApi,
};

export default api;