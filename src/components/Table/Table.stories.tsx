import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./index";
import React from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const sampleData: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    role: "Usuário",
    status: "active",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@email.com",
    role: "Editor",
    status: "inactive",
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@email.com",
    role: "Usuário",
    status: "active",
  },
];

const columns = [
  { key: "name", header: "Nome", render: (item: User) => item.name },
  { key: "email", header: "Email", render: (item: User) => item.email },
  { key: "role", header: "Papel", render: (item: User) => item.role },
  {
    key: "status",
    header: "Status",
    align: "center" as const,
    render: (item: User) =>
      React.createElement(
        "span",
        {
          className: `px-2 py-1 rounded-full text-xs font-medium ${
            item.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`,
        },
        item.status === "active" ? "Ativo" : "Inativo",
      ),
  },
];

const meta: Meta<typeof Table<User>> = {
  title: "Components/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table<User>>;

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
    keyExtractor: (item: User) => item.id,
  },
};

export const Clickable: Story = {
  args: {
    columns,
    data: sampleData,
    keyExtractor: (item: User) => item.id,
    onRowClick: (item: User) => alert(`Clicou em: ${item.name}`),
  },
};

export const IsLoading: Story = {
  args: {
    columns,
    data: [],
    isLoading: true,
    keyExtractor: (item: User) => item.id,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    keyExtractor: (item: User) => item.id,
    emptyMessage: "Nenhum usuário encontrado",
  },
};
