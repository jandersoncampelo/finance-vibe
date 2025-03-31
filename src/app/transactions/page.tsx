"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, ArrowDown, ArrowUp, Calendar, Download, Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import api, { Transaction } from "@/lib/api"

export default function TransactionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTransactionOpen, setNewTransactionOpen] = useState(false)
  const [editTransactionOpen, setEditTransactionOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const pageSize = 10

  // Get transactions with pagination and filters
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        const type = activeFilter === "income" ? "income" : 
                  activeFilter === "expense" ? "expense" : undefined
        
        const result = await api.transaction.getAll({
          page: currentPage,
          limit: pageSize,
          type: type
        })
        
        setTransactions(result.data)
        setTotalTransactions(result.total)
        setError(null)
      } catch (err) {
        setError('Error fetching transactions: ' + (err instanceof Error ? err.message : 'Unknown error'))
        console.error('Error fetching transactions:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [currentPage, activeFilter])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Handle filter changes
  const handleFilterChange = (value: string) => {
    setActiveFilter(value === 'all' ? null : value)
    setCurrentPage(1)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality (this would typically update URL params and trigger a refetch)
    console.log('Searching for:', searchQuery)
  }

  // Handle adding a new transaction
  const handleAddTransaction = async (formData: FormData) => {
    try {
      const newTransaction = {
        date: formData.get('date') as string,
        description: formData.get('description') as string,
        amount: parseFloat(formData.get('amount') as string),
        type: formData.get('type') as 'income' | 'expense',
        category: formData.get('category') as string,
      }

      await api.transaction.create(newTransaction)
      
      // Refetch transactions to include the new one
      const result = await api.transaction.getAll({
        page: currentPage,
        limit: pageSize,
        type: activeFilter === "income" ? "income" : 
              activeFilter === "expense" ? "expense" : undefined
      })
      
      setTransactions(result.data)
      setTotalTransactions(result.total)
      setNewTransactionOpen(false)
    } catch (err) {
      setError('Error adding transaction: ' + (err instanceof Error ? err.message : 'Unknown error'))
      console.error('Error adding transaction:', err)
    }
  }

  // Handle editing a transaction
  const handleEditTransaction = async (formData: FormData) => {
    if (!selectedTransaction) return
    
    try {
      const updatedTransaction = {
        date: formData.get('date') as string,
        description: formData.get('description') as string,
        amount: parseFloat(formData.get('amount') as string),
        type: formData.get('type') as 'income' | 'expense',
        category: formData.get('category') as string,
      }

      await api.transaction.update(selectedTransaction.id, updatedTransaction)
      
      // Refetch transactions to include the updated one
      const result = await api.transaction.getAll({
        page: currentPage,
        limit: pageSize,
        type: activeFilter === "income" ? "income" : 
              activeFilter === "expense" ? "expense" : undefined
      })
      
      setTransactions(result.data)
      setTotalTransactions(result.total)
      setEditTransactionOpen(false)
      setSelectedTransaction(null)
    } catch (err) {
      setError('Error updating transaction: ' + (err instanceof Error ? err.message : 'Unknown error'))
      console.error('Error updating transaction:', err)
    }
  }

  // Handle deleting a transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Você tem certeza que deseja excluir esta transação?')) return
    
    try {
      await api.transaction.delete(id)
      
      // Refetch transactions to update the list
      const result = await api.transaction.getAll({
        page: currentPage,
        limit: pageSize,
        type: activeFilter === "income" ? "income" : 
              activeFilter === "expense" ? "expense" : undefined
      })
      
      setTransactions(result.data)
      setTotalTransactions(result.total)
    } catch (err) {
      setError('Error deleting transaction: ' + (err instanceof Error ? err.message : 'Unknown error'))
      console.error('Error deleting transaction:', err)
    }
  }

  // Open edit dialog for a transaction
  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setEditTransactionOpen(true)
  }

  // Format date to YYYY-MM-DD for input field
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  // Calculate number of pages
  const totalPages = Math.ceil(totalTransactions / pageSize)

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transações Financeiras</h1>
        
        <Dialog open={newTransactionOpen} onOpenChange={setNewTransactionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Transação</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da transação abaixo.
              </DialogDescription>
            </DialogHeader>
            <form action={async (formData) => {
              await handleAddTransaction(formData)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" name="description" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <select id="type" name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="income">Receita</option>
                      <option value="expense">Despesa</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input id="category" name="category" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Transação</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Transaction Dialog */}
        <Dialog open={editTransactionOpen} onOpenChange={setEditTransactionOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Transação</DialogTitle>
              <DialogDescription>
                Modifique os detalhes da transação abaixo.
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <form action={async (formData) => {
                await handleEditTransaction(formData)
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-date">Data</Label>
                      <Input 
                        id="edit-date" 
                        name="date" 
                        type="date" 
                        defaultValue={formatDateForInput(selectedTransaction.date)}
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-amount">Valor</Label>
                      <Input 
                        id="edit-amount" 
                        name="amount" 
                        type="number" 
                        step="0.01" 
                        defaultValue={Math.abs(selectedTransaction.amount)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Descrição</Label>
                    <Input 
                      id="edit-description" 
                      name="description" 
                      defaultValue={selectedTransaction.description}
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-type">Tipo</Label>
                      <select 
                        id="edit-type" 
                        name="type" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        defaultValue={selectedTransaction.type}
                      >
                        <option value="income">Receita</option>
                        <option value="expense">Despesa</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category">Categoria</Label>
                      <Input 
                        id="edit-category" 
                        name="category" 
                        defaultValue={selectedTransaction.category || ''}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditTransactionOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta transação?')) {
                        handleDeleteTransaction(selectedTransaction.id)
                        setEditTransactionOpen(false)
                      }
                    }}
                  >
                    Excluir
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="Buscar transações..." 
              className="flex-1" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>Este Mês</span>
          </Button>
          <Tabs defaultValue="all" onValueChange={handleFilterChange} className="w-[250px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <Alert className="mb-6">
          <AlertTitle>Carregando</AlertTitle>
          <AlertDescription>
            Carregando transações...
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category || '-'}</TableCell>
                      <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </TableCell>
                      <TableCell>
                        {transaction.type === 'income' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <ArrowUp className="h-3.5 w-3.5 mr-1" />
                            Receita
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <ArrowDown className="h-3.5 w-3.5 mr-1" />
                            Despesa
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(transaction)}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {transactions.length} de {totalTransactions} transações
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}