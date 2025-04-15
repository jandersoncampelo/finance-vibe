'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Card, Modal, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

export default function CategoriesPage() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { message } = App.useApp();

  // Carregar categorias ao montar o componente
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      message.error('Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      if (editingCategory) {
        // Atualizar categoria existente
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar categoria');
        }

        message.success('Categoria atualizada com sucesso!');
      } else {
        // Criar nova categoria
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar categoria');
        }

        message.success('Categoria cadastrada com sucesso!');
      }
      
      // Recarregar categorias
      fetchCategories();
      
      form.resetFields();
      setEditingCategory(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      message.error('Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir categoria');
      }

      message.success('Categoria excluída com sucesso!');
      
      // Recarregar categorias
      fetchCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      message.error('Erro ao excluir categoria');
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
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
            title="Excluir categoria"
            description="Tem certeza que deseja excluir esta categoria?"
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
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Nova Categoria
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={categories}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
        />
      </Card>

      <Modal
        title={editingCategory ? "Editar Categoria" : "Nova Categoria"}
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
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Digite o nome da categoria' }]}
          >
            <Input />
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

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {editingCategory ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 