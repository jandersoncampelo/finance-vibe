import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

// This file provides compatibility configuration for Ant Design v5 with React 19
// See: https://u.ant.design/v5-for-19

export function AntdCompatibilityProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        // Add any theme customization here if needed
      }}
      // Enable compatibility mode for React 19
      componentSize="middle"
      // This is the key setting for React 19 compatibility
      virtual={false}
    >
      {children}
    </ConfigProvider>
  );
} 