"use client"

import { Search } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Product } from "@/lib/types"

interface ProductRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductRegistrationDialog({
  open,
  onOpenChange,
  product
}: ProductRegistrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <Input id="productName" defaultValue={product?.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="productCode">Código</Label>
                  <Input id="productCode" placeholder="Código interno" defaultValue={product?.code} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="productPrice">Preço</Label>
                  <Input id="productPrice" type="number" defaultValue={product?.price} />
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={() => onOpenChange(false)}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}