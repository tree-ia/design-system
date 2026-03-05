import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComparisonLineChart } from "./index";

const meta: Meta<typeof ComparisonLineChart> = {
  title: "Charts/ComparisonLineChart",
  component: ComparisonLineChart,
};

export default meta;
type Story = StoryObj<typeof ComparisonLineChart>;

export const Default: Story = {
  args: {
    title: "Comparação de Vendas",
    labels: ["01/03", "02/03", "03/03", "04/03", "05/03", "06/03", "07/03"],
    currentPeriodData: [120, 180, 95, 210, 175, 250, 190],
    previousPeriodData: [90, 150, 110, 170, 140, 200, 160],
    currentPeriodLabel: "Últimos 7 dias",
    previousPeriodLabel: "7 dias anteriores",
  },
};

export const CustomColor: Story = {
  args: {
    title: "Receita por Período",
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    currentPeriodData: [4500, 5200, 3800, 6100, 5700, 7200, 6800],
    previousPeriodData: [3200, 4100, 3500, 5000, 4800, 6000, 5500],
    color: "#ff521d",
  },
};
