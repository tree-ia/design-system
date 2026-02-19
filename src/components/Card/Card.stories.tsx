import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./index";
import { Button } from "../Button";
import React from "react";
import { BarChart3, Settings } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    showDivider: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "Resumo de Vendas",
    children: React.createElement(
      "p",
      { className: "text-gray-600" },
      "Conteúdo do card aqui.",
    ),
  },
};

export const WithIcon: Story = {
  args: {
    title: "Métricas",
    icon: React.createElement(BarChart3, { className: "h-5 w-5" }),
    children: React.createElement(
      "p",
      { className: "text-gray-600" },
      "Dados de métricas.",
    ),
  },
};

export const WithHeaderActions: Story = {
  args: {
    title: "Configurações",
    icon: React.createElement(Settings, { className: "h-5 w-5" }),
    headerActions: React.createElement(
      Button,
      { variant: "ghost", size: "sm" },
      "Editar",
    ),
    children: React.createElement(
      "p",
      { className: "text-gray-600" },
      "Conteúdo com ações.",
    ),
  },
};

export const WithSubtitleAndDivider: Story = {
  args: {
    title: "Pedidos Recentes",
    subtitle: "Últimos 30 dias",
    showDivider: true,
    children: React.createElement(
      "p",
      { className: "text-gray-600" },
      "Lista de pedidos.",
    ),
  },
};

export const Simple: Story = {
  args: {
    children: React.createElement(
      "div",
      { className: "text-center py-8" },
      React.createElement(
        "h3",
        { className: "text-2xl font-bold text-gray-900" },
        "R$ 12.450,00",
      ),
      React.createElement(
        "p",
        { className: "text-gray-500 mt-1" },
        "Total do mês",
      ),
    ),
  },
};
