"use client"

import { AlertCircle, CheckCircle2, Plus, Search, Truck } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Merchant } from "@/lib/types"
import { ConfidenceIndicator } from "./ConfidenceIndicator"

interface SupplierCardProps {
  merchant: Merchant | null | undefined;
  onOpenSupplierDialog: () => void;
}

export function SupplierCard({ merchant, onOpenSupplierDialog }: SupplierCardProps) {
  // Caso o merchant seja nulo ou indefinido, use um objeto vazio com valores padrão
  const safemerchant = merchant || {
    name: 'Não disponível',
    nameConfidence: null,
    cnpj: 'Não disponível',
    cnpjConfidence: null,
    address: 'Não disponível',
    addressConfidence: null,
    isRegistered: false
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Informações do Fornecedor
          </CardTitle>
          {safemerchant.isRegistered ? (
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
        {!safemerchant.isRegistered && (
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
            <p>{safemerchant.name || 'Não disponível'}</p>
            {safemerchant.nameConfidence !== null && safemerchant.nameConfidence !== undefined && (
              <ConfidenceIndicator value={safemerchant.nameConfidence} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
            <p>{safemerchant.cnpj || 'Não disponível'}</p>
            {safemerchant.cnpjConfidence !== null && safemerchant.cnpjConfidence !== undefined && (
              <ConfidenceIndicator value={safemerchant.cnpjConfidence} />
            )}
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
            <p>{safemerchant.address || 'Não disponível'}</p>
            {safemerchant.addressConfidence !== null && safemerchant.addressConfidence !== undefined && (
              <ConfidenceIndicator value={safemerchant.addressConfidence} />
            )}
          </div>
        </div>
      </CardContent>
      {!safemerchant.isRegistered && (
        <CardFooter>
          <Button onClick={onOpenSupplierDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Fornecedor
          </Button>
          
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
  );
}