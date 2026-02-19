import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./index";
import React, { useState } from "react";
import { LayoutDashboard, ShoppingCart, Users } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState("tab1");
    return React.createElement(Tabs, {
      tabs: [
        { id: "tab1", label: "Geral" },
        { id: "tab2", label: "Detalhes" },
        { id: "tab3", label: "Configurações" },
      ],
      activeTab: active,
      onChange: setActive,
    });
  },
};

export const WithCount: Story = {
  render: () => {
    const [active, setActive] = useState("all");
    return React.createElement(Tabs, {
      tabs: [
        { id: "all", label: "Todos", count: 42 },
        { id: "active", label: "Ativos", count: 38 },
        { id: "inactive", label: "Inativos", count: 4 },
      ],
      activeTab: active,
      onChange: setActive,
    });
  },
};

export const WithIcons: Story = {
  render: () => {
    const [active, setActive] = useState("dashboard");
    return React.createElement(Tabs, {
      tabs: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: React.createElement(LayoutDashboard, { className: "h-4 w-4" }),
        },
        {
          id: "orders",
          label: "Pedidos",
          count: 12,
          icon: React.createElement(ShoppingCart, { className: "h-4 w-4" }),
        },
        {
          id: "customers",
          label: "Clientes",
          icon: React.createElement(Users, { className: "h-4 w-4" }),
        },
      ],
      activeTab: active,
      onChange: setActive,
    });
  },
};
