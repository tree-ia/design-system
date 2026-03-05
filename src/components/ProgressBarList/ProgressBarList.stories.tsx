import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBarList } from "./index";
import React from "react";

const meta: Meta<typeof ProgressBarList> = {
  title: "Charts/ProgressBarList",
  component: ProgressBarList,
};

export default meta;
type Story = StoryObj<typeof ProgressBarList>;

export const Default: Story = {
  args: {
    title: "Formas de pagamento mais usadas",
    items: [
      { label: "Pix", value: 150 },
      { label: "Crédito", value: 85 },
      { label: "Débito", value: 60 },
      { label: "Dinheiro", value: 35 },
      { label: "Carteira Digital", value: 12 },
    ],
    valueLabel: "vendas",
    valueLabelSingular: "venda",
  },
};

export const CustomFormat: Story = {
  args: {
    title: "Categorias por receita",
    items: [
      { label: "Pizzas", value: 12500 },
      { label: "Hambúrgueres", value: 8900 },
      { label: "Bebidas", value: 5400 },
      { label: "Sobremesas", value: 3200 },
    ],
    formatValue: (v: number) =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v),
  },
};
