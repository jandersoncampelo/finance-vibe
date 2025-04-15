'use client';

import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Table, Card, Modal, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Account {
  id: number;
  name: string;
  balance: number;
  type: string;
}

export default function AccountsPage() {
  const [form] = Form.useForm();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { message } = App.useApp();

  // Carregar contas ao montar o componente
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Erro ao carregar contas');
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      message.error('Erro ao carregar contas');
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      form.setFieldsValue(account);
    } else {
      setEditingAccount(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingAccount(null);
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      if (editingAccount) {
        // Atualizar conta existente
        const response = await fetch(`/api/accounts/${editingAccount.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar conta');
        }

        message.success('Conta atualizada com sucesso!');
      } else {
        // Criar nova conta
        const response = await fetch('/api/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar conta');
        }

        message.success('Conta cadastrada com sucesso!');
      }
      
      // Recarregar contas
      fetchAccounts();
      
      form.resetFields();
      setEditingAccount(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      message.error('Erro ao salvar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir conta');
      }

      message.success('Conta excluída com sucesso!');
      
      // Recarregar contas
      fetchAccounts();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      message.error('Erro ao excluir conta');
    }
  };

  const columns: ColumnsType<Account> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Saldo',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => 
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(balance),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          'checking': 'Conta Corrente',
          'savings': 'Poupança',
          'credit': 'Cartão de Crédito',
          'investment': 'Investimento',
          'other': 'Outro',
        };
        return typeMap[type] || type;
      },
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
            title="Excluir conta"
            description="Tem certeza que deseja excluir esta conta?"
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
        <h1 className="text-2xl font-bold">Contas</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Nova Conta
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={accounts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
        />
      </Card>

      <Modal
        title={editingAccount ? "Editar Conta" : "Nova Conta"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: 'checking' }}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Digite o nome da conta' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="balance"
            label="Saldo Inicial"
            rules={[{ required: true, message: 'Digite o saldo inicial' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/R\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: 'Selecione o tipo' }]}
          >
            <Select>
              <Option value="checking">Conta Corrente</Option>
              <Option value="savings">Poupança</Option>
              <Option value="credit">Cartão de Crédito</Option>
              <Option value="investment">Investimento</Option>
              <Option value="other">Outro</Option>
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
              {editingAccount ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 