"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2, FileText, Plus, Search, ShoppingBag, Truck } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import api from "@/lib/api"
import { Product, PendingInvoice } from "../../lib/types"

function ConfidenceIndicator({ value }: { value: number }) {
  // Determine color based on confidence value
  const getColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500";
    if (confidence >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getColor(value)} rounded-full`} 
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{value}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Nível de confiança: {value}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function InvoiceDisplay() {
  console.log('Component rendering...')
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false)
  const [openProductDialog, setOpenProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [pendingInvoices, setPendingInvoices] = useState<PendingInvoice[]>([])
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('useEffect triggered')
    // Function to fetch pending invoices using the API service
    const fetchPendingInvoices = async () => {
      console.log('Starting fetchPendingInvoices...')
      setIsLoading(true)
      try {
        console.log('Making API call to fetch pending invoices...')
        const data = await api.invoice.getPendingInvoices()
        console.log('API call successful. Response:', data)
        setPendingInvoices(data)
        setError(null)
      } catch (err) {
        console.error('Detailed API error:', err)
        setError('Error fetching pending invoices: ' + (err instanceof Error ? err.message : 'Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    // Call the fetch function when component mounts
    fetchPendingInvoices()
  }, [])

  const handleRegisterProduct = (product: Product) => {
    setSelectedProduct(product)
    setOpenProductDialog(true)
  }

  // Use the first pending invoice or fall back to mock data if API call fails
  const invoiceData = pendingInvoices.length > 0 ? pendingInvoices[selectedInvoiceIndex] : {
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
          {invoiceData.id}
        </Badge>
      </div>

      {/* Supplier Information */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Informações do Fornecedor
            </CardTitle>
            {invoiceData.merchant.isRegistered ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Cadastrado
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Não Cadastrado
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!invoiceData.merchant.isRegistered && (
            <Alert variant="default" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fornecedor não cadastrado</AlertTitle>
              <AlertDescription>
                Este fornecedor não está cadastrado no sistema. Cadastre-o para continuar com o processamento da fatura.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p>{invoiceData.merchant.name}</p>
              <ConfidenceIndicator value={invoiceData.merchant.nameConfidence} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
              <p>{invoiceData.merchant.cnpj}</p>
              <ConfidenceIndicator value={invoiceData.merchant.cnpjConfidence} />
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Endereço</p>
              <p>{invoiceData.merchant.address}</p>
              <ConfidenceIndicator value={invoiceData.merchant.addressConfidence} />
            </div>
          </div>
        </CardContent>
        {!invoiceData.merchant.isRegistered && (
          <CardFooter>
            <Dialog open={openSupplierDialog} onOpenChange={setOpenSupplierDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Fornecedor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Fornecedor</DialogTitle>
                  <DialogDescription>Preencha os dados do fornecedor para cadastrá-lo no sistema.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" defaultValue={invoiceData.merchant.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taxId">CNPJ</Label>
                    <Input id="taxId" defaultValue={invoiceData.merchant.cnpj} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" defaultValue={invoiceData.merchant.address} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setOpenSupplierDialog(false)}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="ml-2">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Fornecedor Existente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Buscar Fornecedor</DialogTitle>
                  <DialogDescription>Busque um fornecedor já cadastrado no sistema.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar por nome ou CNPJ..." className="flex-1" />
                    <Button variant="secondary">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>CNPJ</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Tech Solutions Inc.</TableCell>
                          <TableCell>11.222.333/0001-44</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Selecionar
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Tech Providers SA</TableCell>
                          <TableCell>55.666.777/0001-88</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Selecionar
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        )}
      </Card>

      {/* Invoice Details */}
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
              <p>{invoiceData.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data da Transação</p>
              <p>{invoiceData.transactionDate}</p>
              <ConfidenceIndicator value={invoiceData.transactionDateConfidence} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {invoiceData.items.some((item) => !item.isRegistered) && (
            <Alert variant="default" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Produtos não cadastrados</AlertTitle>
              <AlertDescription>
                Alguns produtos desta fatura não estão cadastrados no sistema. Cadastre-os para continuar.
              </AlertDescription>
            </Alert>
          )}

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
                {invoiceData.items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell>
                      {item.description}
                      <ConfidenceIndicator value={item.descriptionConfidence} />
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                      <div className="flex justify-end">
                        <ConfidenceIndicator value={item.quantityConfidence} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {item.price.toFixed(2)}
                      <div className="flex justify-end">
                        <ConfidenceIndicator value={item.priceConfidence} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">R$ {item.totalPrice.toFixed(2)}</TableCell>
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
                        <ConfidenceIndicator value={Math.round((item.descriptionConfidence + item.priceConfidence + item.quantityConfidence) / 3)} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {!item.isRegistered && (
                        <Button variant="ghost" size="sm" onClick={() => handleRegisterProduct(item)}>
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
                    R$ {invoiceData.total.toFixed(2)}
                    <div className="flex justify-end">
                      <ConfidenceIndicator value={invoiceData.totalConfidence} />
                    </div>
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button disabled={!invoiceData.merchant.isRegistered || invoiceData.items.some((item) => !item.isRegistered)}>
            Processar Fatura
          </Button>
        </CardFooter>
      </Card>

      {/* Product Registration Dialog */}
      <Dialog open={openProductDialog} onOpenChange={setOpenProductDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Cadastro de Produto</DialogTitle>
            <DialogDescription>Cadastre o produto ou vincule a um produto existente.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="new">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">Novo Produto</TabsTrigger>
              <TabsTrigger value="existing">Produto Existente</TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="productName">Nome do Produto</Label>
                  <Input id="productName" defaultValue={selectedProduct?.description} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="productCode">Código</Label>
                    <Input id="productCode" placeholder="Código interno" defaultValue={selectedProduct?.code} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productPrice">Preço</Label>
                    <Input id="productPrice" type="number" defaultValue={selectedProduct?.price} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="productCategory">Categoria</Label>
                  <Input id="productCategory" placeholder="Categoria do produto" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="existing" className="py-4">
              <div className="flex items-center space-x-2 mb-4">
                <Input placeholder="Buscar produto..." className="flex-1" />
                <Button variant="secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Monitor UltraWide 32</TableCell>
                      <TableCell>MON-32UW</TableCell>
                      <TableCell className="text-right">R$ 489.99</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Vincular
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Monitor UltraWide 34</TableCell>
                      <TableCell>MON-34UW</TableCell>
                      <TableCell className="text-right">R$ 529.99</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Vincular
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenProductDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={() => setOpenProductDialog(false)}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}