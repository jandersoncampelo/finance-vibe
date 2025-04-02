"use client"

import { useState, useEffect } from "react"
import { AlertCircle, FileText, ChevronDown } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { Product, PendingInvoice, PendingInvoicesResponse } from "@/lib/types"

// Import the extracted components
import { ConfidenceIndicator } from "./components/ConfidenceIndicator"
import { SupplierCard } from "./components/SupplierCard"
import { SupplierRegistrationDialog } from "./components/SupplierRegistrationDialog"
import { InvoiceDetailsCard } from "./components/InvoiceDetailsCard"
import { ProductsTable } from "./components/ProductsTable"
import { ProductRegistrationDialog } from "./components/ProductRegistrationDialog"

// Dados de fatura padrão para ser usados quando a API retornar dados incompletos
const defaultInvoiceData: PendingInvoice = {
  id: "INV-2023-0042",
  confidence: 90,
  merchant: {
    name: "Tech Supplies Ltd",
    nameConfidence: 85,
    cnpj: "12.345.678/0001-90",
    cnpjConfidence: 92,
    address: "123 Tech Street, Tech City",
    addressConfidence: 70,
    isRegistered: false
  },
  items: [
    {
      code: 1,
      codeConfidence: 95,
      description: "Laptop Dell XPS 15",
      descriptionConfidence: 96,
      quantity: 2,
      quantityConfidence: 99,
      price: 899.99,
      priceConfidence: 95,
      unit: "un",
      unitConfidence: 100,
      totalPrice: 1799.98,
      totalPriceConfidence: 97,
      isRegistered: true,
    },
    {
      code: 2,
      codeConfidence: 90,
      description: "Monitor UltraWide 34\"",
      descriptionConfidence: 78,
      quantity: 1,
      quantityConfidence: 99,
      price: 499.99,
      priceConfidence: 85,
      unit: "un",
      unitConfidence: 100,
      totalPrice: 499.99,
      totalPriceConfidence: 92,
      isRegistered: false,
    },
    {
      code: 3,
      codeConfidence: 88,
      description: "Wireless Keyboard",
      descriptionConfidence: 88,
      quantity: 3,
      quantityConfidence: 97,
      price: 50.25,
      priceConfidence: 90,
      unit: "un",
      unitConfidence: 100,
      totalPrice: 150.75,
      totalPriceConfidence: 95,
      isRegistered: true,
    },
  ],
  total: 2450.75,
  totalConfidence: 98,
  totalTax: 245.07,
  totalTaxConfidence: 90,
  transactionDate: "2023-11-15",
  transactionDateConfidence: 95,
  isRegistered: false
};

// Main component
export default function InvoiceDisplay() {
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false)
  const [openProductDialog, setOpenProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [pendingInvoices, setPendingInvoices] = useState<PendingInvoice[]>([])
  const [continuationToken, setContinuationToken] = useState<string | undefined>(undefined)
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch pending invoices using the API service
  const fetchPendingInvoices = async (token?: string) => {
    if (token) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }
    
    try {
      const data = await api.invoice.getPendingInvoices(token)
      if (token) {
        // Append new invoices to existing ones
        setPendingInvoices(prev => [...prev, ...(data.results || [])])
      } else {
        // Replace existing invoices with new ones
        setPendingInvoices(data.results || [])
      }
      // Store the continuation token for pagination
      setContinuationToken(data.continuationToken)
      setError(null)
    } catch (err) {
      console.error('Detailed API error:', err)
      setError('Error fetching pending invoices: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    // Call the fetch function when component mounts
    fetchPendingInvoices()
  }, [])

  const handleRegisterProduct = (product: Product) => {
    setSelectedProduct(product)
    setOpenProductDialog(true)
  }

  const handleOpenSupplierDialog = () => {
    setOpenSupplierDialog(true)
  }

  const handleLoadMore = () => {
    if (continuationToken) {
      fetchPendingInvoices(continuationToken)
    }
  }

  // Use the first pending invoice or fall back to mock data if API call fails
  const invoiceData = pendingInvoices.length > 0 ? pendingInvoices[selectedInvoiceIndex] : defaultInvoiceData;

  // Garantir que valores esperados existam, mesmo que venham nulos da API
  const safeInvoiceData = {
    ...invoiceData,
    id: invoiceData.id || 'ID não disponível', // ID é o único campo que não deveria ser nulo
    merchant: invoiceData.merchant || defaultInvoiceData.merchant,
    items: invoiceData.items || [],
    total: invoiceData.total !== null && invoiceData.total !== undefined ? invoiceData.total : 0,
    totalConfidence: invoiceData.totalConfidence,
    totalTax: invoiceData.totalTax,
    totalTaxConfidence: invoiceData.totalTaxConfidence,
    transactionDate: invoiceData.transactionDate || 'Data não disponível',
    transactionDateConfidence: invoiceData.transactionDateConfidence,
    isRegistered: invoiceData.isRegistered || false
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      {isLoading && (
        <Alert className="mb-6">
          <AlertTitle>Loading</AlertTitle>
          <AlertDescription>
            Carregando faturas pendentes...
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Fatura de Compra</h1>
        </div>
        <Badge variant="outline" className="text-sm">
          {safeInvoiceData.id}
        </Badge>
      </div>

      {/* Navigation between invoices */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {selectedInvoiceIndex + 1} de {pendingInvoices.length}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedInvoiceIndex(prev => Math.max(0, prev - 1))}
            disabled={selectedInvoiceIndex === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedInvoiceIndex(prev => Math.min(pendingInvoices.length - 1, prev + 1))}
            disabled={selectedInvoiceIndex === pendingInvoices.length - 1 || pendingInvoices.length === 0}
          >
            Próxima
          </Button>
        </div>
      </div>

      {/* Supplier Information */}
      <SupplierCard 
        merchant={safeInvoiceData.merchant} 
        onOpenSupplierDialog={handleOpenSupplierDialog} 
      />
      
      {/* Supplier Registration Dialog */}
      <SupplierRegistrationDialog 
        open={openSupplierDialog} 
        onOpenChange={setOpenSupplierDialog}
        merchant={safeInvoiceData.merchant}
      />

      {/* Invoice Details */}
      <InvoiceDetailsCard invoice={safeInvoiceData} />

      {/* Products Table */}
      <ProductsTable 
        products={safeInvoiceData.items}
        total={safeInvoiceData.total}
        totalConfidence={safeInvoiceData.totalConfidence}
        onRegisterProduct={handleRegisterProduct}
        supplierRegistered={safeInvoiceData.merchant?.isRegistered}
      />

      {/* Product Registration Dialog */}
      <ProductRegistrationDialog 
        open={openProductDialog}
        onOpenChange={setOpenProductDialog}
        product={selectedProduct}
      />

      {/* Load More Button */}
      {continuationToken && (
        <div className="flex justify-center mt-8 mb-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2"
          >
            {isLoadingMore ? "Carregando..." : "Carregar mais faturas"}
            {!isLoadingMore && <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  )
}