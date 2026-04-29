import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Header } from "./index";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

const menuItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Pedidos", href: "/orders", icon: ShoppingCart },
  { id: "conversations", label: "Conversas", href: "/conversations", icon: MessageSquare },
  { id: "products", label: "Produtos", href: "/products", icon: Package },
  { id: "customers", label: "Clientes", href: "/customers", icon: Users },
  { id: "settings", label: "Configurações", href: "/settings", icon: Settings },
];

const user = {
  name: "João Silva",
  email: "joao@empresa.com",
  subtitle: "Empresa XYZ",
};

const logo = React.createElement(
  "span",
  { className: "text-xl font-bold text-[var(--dashboard-sidebar-text)]" },
  "MinhaApp",
);

export const Default: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "min-h-screen bg-[var(--dashboard-background,#f2f2f2)] pt-16" },
      React.createElement(Header, {
        menuItems,
        logo,
        currentPath: "/dashboard",
        user,
        onUserClick: () => alert("User clicked"),
        onLogout: () => alert("Logout"),
      }),
      React.createElement(
        "main",
        { className: "p-8 text-[var(--dashboard-text-primary,#2d2d2d)]" },
        React.createElement("h1", { className: "text-2xl font-bold" }, "Conteúdo do dashboard"),
      ),
    ),
};

export const WithoutUser: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "min-h-screen bg-[var(--dashboard-background,#f2f2f2)] pt-16" },
      React.createElement(Header, {
        menuItems,
        logo,
        currentPath: "/orders",
      }),
    ),
};
