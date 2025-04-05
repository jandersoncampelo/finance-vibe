'use client';

import { Layout, Menu } from "antd";
import { HomeOutlined, WalletOutlined, BarChartOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const { Header, Content, Sider } = Layout;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      onClick: () => router.push('/'),
    },
    {
      key: '/transactions',
      icon: <WalletOutlined />,
      label: 'Transações',
      onClick: () => router.push('/transactions'),
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Relatórios',
      onClick: () => router.push('/reports'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu 
          theme="dark" 
          mode="inline" 
          items={menuItems}
          selectedKeys={[pathname]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '16px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 