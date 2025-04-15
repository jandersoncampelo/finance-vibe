'use client';

import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Table, Card, Modal, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

interface Account {
  id: number;
  name: string;
  balance: number;
  type: string;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  categoryId: number;
  category?: Category;
  accountId: number;
  account?: Account;
}

export default function TransactionsPage() {
  const [form] = Form.useForm();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { message } = App.useApp();

  // Carregar transações, categorias e contas ao montar o componente
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchAccounts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      message.error('Erro ao carregar categorias');
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Erro ao carregar contas');
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      message.error('Erro ao carregar contas');
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Erro ao carregar transações');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      message.error('Erro ao carregar transações');
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      form.setFieldsValue({
        ...transaction,
        date: dayjs(transaction.date),
      });
    } else {
      setEditingTransaction(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      const transactionData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };
      
      if (editingTransaction) {
        // Atualizar transação existente
        const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionData),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar transação');
        }

        message.success('Transação atualizada com sucesso!');
      } else {
        // Criar nova transação
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionData),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar transação');
        }

        message.success('Transação cadastrada com sucesso!');
      }
      
      // Recarregar transações
      fetchTransactions();
      
      form.resetFields();
      setEditingTransaction(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      message.error('Erro ao salvar transação');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir transação');
      }

      message.success('Transação excluída com sucesso!');
      
      // Recarregar transações
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      message.error('Erro ao excluir transação');
    }
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Transaction) => (
        <span className={record.type === 'income' ? 'text-green-600' : 'text-red-600'}>
          R$ {amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      render: (category: Category) => category?.name || '-',
    },
    {
      title: 'Conta',
      dataIndex: 'account',
      key: 'account',
      render: (account: Account) => account?.name || '-',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type === 'income' ? 'Receita' : 'Despesa',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Excluir transação"
            description="Tem certeza que deseja excluir esta transação?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Nova Transação
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
        />
      </Card>

      <Modal
        title={editingTransaction ? "Editar Transação" : "Nova Transação"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: 'expense' }}
        >
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: 'Digite a descrição' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Valor"
            rules={[{ required: true, message: 'Digite o valor' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/R\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Data"
            rules={[{ required: true, message: 'Selecione a data' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: 'Selecione o tipo' }]}
          >
            <Select>
              <Option value="income">Receita</Option>
              <Option value="expense">Despesa</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Categoria"
            rules={[{ required: true, message: 'Selecione a categoria' }]}
          >
            <Select>
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="accountId"
            label="Conta"
            rules={[{ required: true, message: 'Selecione a conta' }]}
          >
            <Select>
              {accounts.map(account => (
                <Option key={account.id} value={account.id}>
                  {account.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {editingTransaction ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 