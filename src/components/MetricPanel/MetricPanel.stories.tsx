import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricPanel } from "./index";
import React from "react";

// Simple icon components for stories
const ShoppingCart = ({ className }: { className?: string }) =>
  React.createElement(
    "svg",
    { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", width: 24, height: 24 },
    React.createElement("circle", { cx: 9, cy: 21, r: 1 }),
    React.createElement("circle", { cx: 20, cy: 21, r: 1 }),
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" }),
  );

const DollarSign = ({ className }: { className?: string }) =>
  React.createElement(
    "svg",
    { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", width: 24, height: 24 },
    React.createElement("line", { x1: 12, y1: 1, x2: 12, y2: 23 }),
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }),
  );

const Users = ({ className }: { className?: string }) =>
  React.createElement(
    "svg",
    { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", width: 24, height: 24 },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    React.createElement("circle", { cx: 9, cy: 7, r: 4 }),
  );

const meta: Meta<typeof MetricPanel> = {
  title: "Charts/MetricPanel",
  component: MetricPanel,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MetricPanel>;

export const SalesPanel: Story = {
  args: {
    title: "Vendas",
    titleIcon: DollarSign,
    actionLabel: "Conferir pedidos",
    onActionClick: () => alert("Ver pedidos"),
    metrics: [
      {
        key: "totalSales",
        label: "Total de vendas",
        icon: ShoppingCart,
        currentLabel: "Últimos 7 dias",
        previousLabel: "7 dias anteriores",
        format: "number",
        unit: "pedidos",
        kpiValue: { current: 384, previous: 320, variation: 20, trend: "up" },
      },
      {
        key: "revenue",
        label: "Receita",
        icon: DollarSign,
        currentLabel: "Últimos 7 dias",
        previousLabel: "7 dias anteriores",
        format: "currency",
        kpiValue: { current: 18750.5, previous: 15200, variation: 23.4, trend: "up" },
      },
      {
        key: "newCustomers",
        label: "Novos clientes",
        icon: Users,
        currentLabel: "Últimos 7 dias",
        previousLabel: "7 dias anteriores",
        format: "number",
        unit: "clientes",
        kpiValue: { current: 45, previous: 52, variation: -13.5, trend: "down" },
      },
    ],
    chartData: {
      labels: ["01/03", "02/03", "03/03", "04/03", "05/03", "06/03", "07/03"],
      metrics: {
        totalSales: {
          currentPeriod: [50, 62, 45, 70, 55, 48, 54],
          previousPeriod: [40, 55, 48, 58, 42, 38, 39],
        },
        revenue: {
          currentPeriod: [2500, 3100, 2200, 3500, 2800, 2400, 2250],
          previousPeriod: [2000, 2700, 2400, 2900, 2100, 1900, 1200],
        },
        newCustomers: {
          currentPeriod: [5, 8, 6, 10, 7, 4, 5],
          previousPeriod: [7, 9, 8, 11, 6, 5, 6],
        },
      },
    },
  },
};

export const Loading: Story = {
  args: {
    ...SalesPanel.args,
    isLoading: true,
  },
};
