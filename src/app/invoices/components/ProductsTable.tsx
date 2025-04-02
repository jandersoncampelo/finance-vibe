"use client"

import { AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Product } from "@/lib/types"
import { ConfidenceIndicator } from "./ConfidenceIndicator"

interface ProductsTableProps {
  products: Product[] | null | undefined;
  total: number | null | undefined;
  totalConfidence: number | null | undefined;
  onRegisterProduct: (product: Product) => void;
  supplierRegistered: boolean | null | undefined;
}

export function ProductsTable({ 
  products, 
  total, 
  totalConfidence, 
  onRegisterProduct,
  supplierRegistered
}: ProductsTableProps) {
  // Uso de valores seguros para evitar erros com valores nulos
  const safeProducts = products || [];
  const safeTotal = total || 0;
  const safeTotalConfidence = totalConfidence || 0;
  const safeSupplierRegistered = !!supplierRegistered;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        {safeProducts.some((item) => !item.isRegistered) && (
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Produtos não cadastrados</AlertTitle>
            <AlertDescription>
              Alguns produtos desta fatura não estão cadastrados no sistema. Cadastre-os para continuar.
            </AlertDescription>
          </Alert>
        )}

        {safeProducts.length === 0 && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sem produtos</AlertTitle>
            <AlertDescription>
              Não há produtos listados nesta fatura.
            </AlertDescription>
          </Alert>
        )}

        {safeProducts.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Confiança</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeProducts.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.description || 'Produto sem descrição'}
                      {item.descriptionConfidence !== null && item.descriptionConfidence !== undefined && (
                        <ConfidenceIndicator value={item.descriptionConfidence} />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity ?? 'N/A'}
                      <div className="flex justify-end">
                        {item.quantityConfidence !== null && item.quantityConfidence !== undefined && (
                          <ConfidenceIndicator value={item.quantityConfidence} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.price !== null && item.price !== undefined 
                        ? `R$ ${item.price.toFixed(2)}` 
                        : 'N/A'}
                      <div className="flex justify-end">
                        {item.priceConfidence !== null && item.priceConfidence !== undefined && (
                          <ConfidenceIndicator value={item.priceConfidence} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.totalPrice !== null && item.totalPrice !== undefined 
                        ? `R$ ${item.totalPrice.toFixed(2)}` 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.isRegistered ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Cadastrado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Não Cadastrado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {item.descriptionConfidence !== null && 
                         item.priceConfidence !== null && 
                         item.quantityConfidence !== null &&
                         item.descriptionConfidence !== undefined &&
                         item.priceConfidence !== undefined &&
                         item.quantityConfidence !== undefined ? (
                          <ConfidenceIndicator value={Math.round(
                            (item.descriptionConfidence + item.priceConfidence + item.quantityConfidence) / 3
                          )} />
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!item.isRegistered && (
                        <Button variant="ghost" size="sm" onClick={() => onRegisterProduct(item)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Cadastrar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total da Fatura
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {safeTotal !== null && safeTotal !== undefined
                      ? `R$ ${safeTotal.toFixed(2)}`
                      : 'N/A'}
                    <div className="flex justify-end">
                      {safeTotalConfidence !== null && safeTotalConfidence !== undefined && (
                        <ConfidenceIndicator value={safeTotalConfidence} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button disabled={!safeSupplierRegistered || safeProducts.some((item) => !item.isRegistered)}>
          Processar Fatura
        </Button>
      </CardFooter>
    </Card>
  );
}