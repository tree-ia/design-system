import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "./index";
import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  Package,
} from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const menuItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Pedidos", href: "/orders", icon: ShoppingCart },
  { id: "products", label: "Produtos", href: "/products", icon: Package },
  { id: "customers", label: "Clientes", href: "/customers", icon: Users },
  { id: "settings", label: "Configurações", href: "/settings", icon: Settings },
];

const user = {
  name: "João Silva",
  email: "joao@empresa.com",
  subtitle: "Empresa XYZ",
};

export const Expanded: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return React.createElement(
      "div",
      { style: { height: "100vh" } },
      React.createElement(Sidebar, {
        menuItems,
        logo: React.createElement(
          "span",
          { className: "text-xl font-bold text-[var(--dashboard-primary)]" },
          "MinhaApp",
        ),
        collapsedLogo: React.createElement(
          "span",
          { className: "text-xl font-bold text-[var(--dashboard-primary)]" },
          "M",
        ),
        currentPath: "/dashboard",
        isCollapsed: collapsed,
        onToggleCollapse: () => setCollapsed(!collapsed),
        user,
        onUserClick: () => alert("User clicked"),
        onLogout: () => alert("Logout"),
      }),
    );
  },
};

export const Collapsed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    return React.createElement(
      "div",
      { style: { height: "100vh" } },
      React.createElement(Sidebar, {
        menuItems,
        logo: React.createElement(
          "span",
          { className: "text-xl font-bold text-[var(--dashboard-primary)]" },
          "MinhaApp",
        ),
        collapsedLogo: React.createElement(
          "span",
          { className: "text-xl font-bold text-[var(--dashboard-primary)]" },
          "M",
        ),
        currentPath: "/orders",
        isCollapsed: collapsed,
        onToggleCollapse: () => setCollapsed(!collapsed),
        user,
        onLogout: () => alert("Logout"),
      }),
    );
  },
};

export const WithoutUser: Story = {
  render: () =>
    React.createElement(
      "div",
      { style: { height: "100vh" } },
      React.createElement(Sidebar, {
        menuItems,
        logo: React.createElement(
          "span",
          { className: "text-xl font-bold text-[var(--dashboard-primary)]" },
          "MinhaApp",
        ),
        currentPath: "/dashboard",
        isCollapsed: false,
      }),
    ),
};
