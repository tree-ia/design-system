import type { Meta, StoryObj } from "@storybook/react-vite";
import { KPICard } from "./index";
import React from "react";

const DollarIcon = () =>
  React.createElement(
    "svg",
    {
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    React.createElement("line", { x1: 12, y1: 1, x2: 12, y2: 23 }),
    React.createElement("path", {
      d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    }),
  );

const meta: Meta<typeof KPICard> = {
  title: "Components/KPICard",
  component: KPICard,
  argTypes: {
    trend: { control: "select", options: ["up", "down", "stable"] },
    format: {
      control: "select",
      options: ["currency", "number", "percentage", "rating"],
    },
    isLoading: { control: "boolean" },
    icon: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof KPICard>;

export const Revenue: Story = {
  args: {
    title: "Receita Total",
    value: 12450.8,
    variation: 12.5,
    trend: "up",
    format: "currency",
  },
};

export const Orders: Story = {
  args: {
    title: "Total de Pedidos",
    value: 384,
    variation: 5.2,
    trend: "up",
    format: "number",
  },
};

export const ConversionRate: Story = {
  args: {
    title: "Taxa de Conversão",
    value: 68.3,
    variation: -2.1,
    trend: "down",
    format: "percentage",
  },
};

export const Rating: Story = {
  args: {
    title: "Satisfação",
    value: 4.7,
    variation: 0,
    trend: "stable",
    format: "rating",
  },
};

export const WithBenchmark: Story = {
  args: {
    title: "Ticket Médio",
    value: 45.9,
    variation: 8.3,
    trend: "up",
    format: "currency",
    benchmark: "Meta: R$ 50,00",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Receita Total",
    value: 12450.8,
    variation: 12.5,
    trend: "up",
    format: "currency",
    icon: React.createElement(DollarIcon),
  },
};

export const Loading: Story = {
  args: {
    title: "Receita Total",
    value: 0,
    variation: 0,
    trend: "stable",
    isLoading: true,
  },
};

export const AllTrends: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "grid grid-cols-3 gap-4" },
      React.createElement(KPICard, {
        title: "Vendas",
        value: 1250,
        variation: 15.3,
        trend: "up",
        format: "number",
      }),
      React.createElement(KPICard, {
        title: "Cancelamentos",
        value: 23,
        variation: -8.7,
        trend: "down",
        format: "number",
      }),
      React.createElement(KPICard, {
        title: "Avaliação",
        value: 4.5,
        variation: 0,
        trend: "stable",
        format: "rating",
      }),
    ),
};
