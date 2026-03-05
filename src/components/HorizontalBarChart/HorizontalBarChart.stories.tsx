import type { Meta, StoryObj } from "@storybook/react-vite";
import { HorizontalBarChart } from "./index";

const meta: Meta<typeof HorizontalBarChart> = {
  title: "Charts/HorizontalBarChart",
  component: HorizontalBarChart,
};

export default meta;
type Story = StoryObj<typeof HorizontalBarChart>;

export const WithTabs: Story = {
  args: {
    title: "Horários com mais vendas",
    labels: [
      "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
      "20:00", "21:00", "22:00",
    ],
    datasets: {
      weekday: [2, 5, 8, 15, 25, 20, 12, 8, 6, 10, 18, 30, 28, 15, 5],
      weekend: [0, 2, 4, 10, 20, 18, 15, 10, 8, 12, 22, 35, 32, 20, 8],
    },
    tabs: [
      { id: "weekday", label: "Durante a semana" },
      { id: "weekend", label: "Final de semana" },
    ],
    valueLabel: "vendas",
    valueLabelSingular: "venda",
    bestItemLabel: "Melhor horário",
  },
};

export const SingleDataset: Story = {
  args: {
    title: "Produtos mais vendidos",
    labels: ["Pizza", "Hambúrguer", "Açaí", "Salada", "Suco"],
    datasets: {
      default: [45, 38, 25, 12, 8],
    },
    valueLabel: "pedidos",
    valueLabelSingular: "pedido",
    bestItemLabel: "Mais vendido",
  },
};
