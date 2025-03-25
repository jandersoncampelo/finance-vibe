"use client"

import { useState } from "react"
import { BarChart, Calendar, DollarSign, LineChart, Percent, PieChart, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data - in a real app, this would come from your API or database
const financialOverview = {
  revenue: 84750.45,
  expenses: 62430.20,
  profit: 22320.25,
  profitMargin: 26.3,
  pendingInvoices: 12,
  pendingAmount: 15425.75,
  cashFlow: [
    { month: 'Jan', revenue: 12500, expenses: 10200 },
    { month: 'Feb', revenue: 14200, expenses: 11500 },
    { month: 'Mar', revenue: 15800, expenses: 12300 },
    { month: 'Apr', revenue: 16400, expenses: 12800 },
    { month: 'Mai', revenue: 13200, expenses: 9800 },
    { month: 'Jun', revenue: 12650, expenses: 9830 }
  ],
  recentTransactions: [
    { id: 'TX-2023-0152', date: '2023-12-02', description: 'Office Supplies', amount: -1250.75, type: 'expense' },
    { id: 'TX-2023-0151', date: '2023-12-01', description: 'Client Payment - ABC Corp', amount: 8500.00, type: 'income' },
    { id: 'TX-2023-0150', date: '2023-11-29', description: 'Software Licenses', amount: -2430.00, type: 'expense' },
    { id: 'TX-2023-0149', date: '2023-11-27', description: 'Client Payment - XYZ Ltd', amount: 12750.50, type: 'income' },
    { id: 'TX-2023-0148', date: '2023-11-25', description: 'Utility Bills', amount: -875.25, type: 'expense' },
  ],
  topExpenseCategories: [
    { category: 'Salaries', amount: 28750.00, percentage: 46 },
    { category: 'Rent', amount: 8500.00, percentage: 13.6 },
    { category: 'Software', amount: 6230.75, percentage: 10 },
    { category: 'Marketing', amount: 5640.25, percentage: 9 },
    { category: 'Office Supplies', amount: 3420.50, percentage: 5.5 },
    { category: 'Other', amount: 9888.70, percentage: 15.9 },
  ],
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("month")
  
  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">Visão geral do seu desempenho financeiro</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>Hoje</span>
          </Button>
          <Tabs defaultValue={timeframe} onValueChange={setTimeframe} className="w-[250px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
              <TabsTrigger value="year">Ano</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(financialOverview.revenue)}</div>
                <Badge className="bg-green-50 text-green-800 border-green-200">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  8.2%
                </Badge>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(financialOverview.expenses)}</div>
                <Badge className="bg-red-50 text-red-800 border-red-200">
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                  3.1%
                </Badge>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(financialOverview.profit)}</div>
                <Badge className="bg-green-50 text-green-800 border-green-200">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  12.4%
                </Badge>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <LineChart className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Margem de Lucro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{financialOverview.profitMargin}%</div>
                <Badge className="bg-green-50 text-green-800 border-green-200">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  2.3%
                </Badge>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Percent className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Receitas vs Despesas</CardTitle>
              <CardDescription>
                Comparativo de receitas e despesas nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md p-4">
                <div className="text-center">
                  <BarChart className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Gráfico de barras (fluxo de caixa)</p>
                  <p className="text-xs text-muted-foreground mt-1">Em um ambiente de produção, este seria um gráfico real com dados.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                Últimas 5 transações registradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialOverview.recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-right">
                <Button variant="outline" size="sm">
                  Ver todas as transações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Faturas Pendentes</CardTitle>
              <CardDescription>
                Resumo de faturas a receber e pagar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Faturas</p>
                    <p className="text-xl font-bold">{financialOverview.pendingInvoices}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                    <p className="text-xl font-bold">{formatCurrency(financialOverview.pendingAmount)}</p>
                  </div>
                </div>
                
                <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md p-4">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Gráfico de faturas por vencimento</p>
                    <p className="text-xs text-muted-foreground mt-1">Em um ambiente de produção, este seria um gráfico real.</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  Ver todas as faturas
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Principais Categorias de Despesas</CardTitle>
              <CardDescription>
                Distribuição de despesas por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialOverview.topExpenseCategories.map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{category.category}</p>
                      <p className="text-sm font-medium">{formatCurrency(category.amount)}</p>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{category.percentage}% do total</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}