"use client"

import { ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PendingInvoice } from "@/lib/types"
import { ConfidenceIndicator } from "./ConfidenceIndicator"

interface InvoiceDetailsCardProps {
  invoice: PendingInvoice;
}

export function InvoiceDetailsCard({ invoice }: InvoiceDetailsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Detalhes da Fatura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Número da Fatura</p>
            <p>{invoice.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data da Transação</p>
            <p>{invoice.transactionDate || 'Não disponível'}</p>
            {invoice.transactionDateConfidence !== null && invoice.transactionDateConfidence !== undefined && (
              <ConfidenceIndicator value={invoice.transactionDateConfidence} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}