"use client"

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

import { Merchant } from "@/lib/types"

interface SupplierRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: Merchant;
}

export function SupplierRegistrationDialog({
  open,
  onOpenChange,
  merchant
}: SupplierRegistrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Fornecedor</DialogTitle>
          <DialogDescription>Preencha os dados do fornecedor para cadastrá-lo no sistema.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" defaultValue={merchant.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="taxId">CNPJ</Label>
            <Input id="taxId" defaultValue={merchant.cnpj} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" defaultValue={merchant.address} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => onOpenChange(false)}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}