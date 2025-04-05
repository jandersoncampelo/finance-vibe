"use client"

import { useState } from "react"
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Componente para indicador de confiança
function ConfidenceIndicator({ value }: { value: number }) {
  // Determine color based on confidence value
  const getColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500"
    if (confidence >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-12 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${getColor(value)} rounded-full`} style={{ width: `${value}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{value}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Nível de confiança: {value}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Mock data para as faturas
const invoices = [
  {
    id: "INV-2023-0042",
    supplier: "Tech Supplies Ltd",
    date: "15/11/2023",
    dueDate: "15/12/2023",
    total: 2450.75,
    status: "pending",
    confidence: 85,
    items: 3,
    isSupplierRegistered: false,
    hasUnregisteredItems: true,
  },
  {
    id: "INV-2023-0041",
    supplier: "Office Solutions Inc",
    date: "12/11/2023",
    dueDate: "12/12/2023",
    total: 1250.0,
    status: "processed",
    confidence: 92,
    items: 5,
    isSupplierRegistered: true,
    hasUnregisteredItems: false,
  },
  {
    id: "INV-2023-0040",
    supplier: "Digital Innovations",
    date: "10/11/2023",
    dueDate: "10/12/2023",
    total: 3750.5,
    status: "pending",
    confidence: 78,
    items: 8,
    isSupplierRegistered: true,
    hasUnregisteredItems: true,
  },
  {
    id: "INV-2023-0039",
    supplier: "Hardware Depot",
    date: "05/11/2023",
    dueDate: "05/12/2023",
    total: 980.25,
    status: "processed",
    confidence: 95,
    items: 4,
    isSupplierRegistered: true,
    hasUnregisteredItems: false,
  },
  {
    id: "INV-2023-0038",
    supplier: "Network Systems",
    date: "01/11/2023",
    dueDate: "01/12/2023",
    total: 5200.0,
    status: "processed",
    confidence: 90,
    items: 12,
    isSupplierRegistered: true,
    hasUnregisteredItems: false,
  },
  {
    id: "INV-2023-0037",
    supplier: "Global Tech Partners",
    date: "28/10/2023",
    dueDate: "28/11/2023",
    total: 1875.3,
    status: "pending",
    confidence: 82,
    items: 6,
    isSupplierRegistered: false,
    hasUnregisteredItems: true,
  },
  {
    id: "INV-2023-0036",
    supplier: "Smart Solutions",
    date: "25/10/2023",
    dueDate: "25/11/2023",
    total: 3450.0,
    status: "processed",
    confidence: 88,
    items: 9,
    isSupplierRegistered: true,
    hasUnregisteredItems: false,
  },
  {
    id: "INV-2023-0035",
    supplier: "Office Furniture Co",
    date: "20/10/2023",
    dueDate: "20/11/2023",
    total: 7250.75,
    status: "processed",
    confidence: 93,
    items: 15,
    isSupplierRegistered: true,
    hasUnregisteredItems: false,
  },
]

export default function InvoiceList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("date")

  // Filtrar faturas com base na pesquisa e filtros
  const filteredInvoices = invoices.filter((invoice) => {
    // Filtro de pesquisa
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de status
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(invoice.status)

    return matchesSearch && matchesStatus
  })

  // Ordenar faturas
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (
          new Date(a.date.split("/").reverse().join("-")).getTime() -
          new Date(b.date.split("/").reverse().join("-")).getTime()
        )
      case "total":
        return b.total - a.total
      case "confidence":
        return b.confidence - a.confidence
      default:
        return 0
    }
  })

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-50 text-green-700 border-green-200"
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "processed":
        return "Processada"
      case "pending":
        return "Pendente"
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Faturas de Compra</h1>
          <p className="text-muted-foreground">Gerencie e visualize todas as suas faturas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fatura
        </Button>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar faturas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("processed")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setStatusFilter([...statusFilter, "processed"])
                  } else {
                    setStatusFilter(statusFilter.filter((s) => s !== "processed"))
                  }
                }}
              >
                Processadas
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("pending")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setStatusFilter([...statusFilter, "pending"])
                  } else {
                    setStatusFilter(statusFilter.filter((s) => s !== "pending"))
                  }
                }}
              >
                Pendentes
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Fornecedor</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Cadastrados</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Não Cadastrados</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Ordenar por" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data (mais recente)</SelectItem>
              <SelectItem value="total">Valor (maior)</SelectItem>
              <SelectItem value="confidence">Confiança (maior)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Faturas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedInvoices.map((invoice) => (
          <Link href={`/invoices/${invoice.id}`} key={invoice.id} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{invoice.id}</h3>
                    <p className="text-sm text-muted-foreground">{invoice.supplier}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(invoice.status)}>
                    {invoice.status === "processed" && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                    {invoice.status === "pending" && <Clock className="h-3.5 w-3.5 mr-1" />}
                    {getStatusText(invoice.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Emissão:</span>
                    </div>
                    <span className="text-sm">{invoice.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Vencimento:</span>
                    </div>
                    <span className="text-sm">{invoice.dueDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Itens:</span>
                    <span className="text-sm">{invoice.items}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confiança:</span>
                    <ConfidenceIndicator value={invoice.confidence} />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">R$ {invoice.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Alertas */}
                <div className="mt-3 space-y-2">
                  {!invoice.isSupplierRegistered && (
                    <div className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-sm">
                      Fornecedor não cadastrado
                    </div>
                  )}
                  {invoice.hasUnregisteredItems && (
                    <div className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-sm">
                      Produtos não cadastrados
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex justify-between w-full">
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <span>
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      Visualizar
                    </span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Baixar PDF
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}

