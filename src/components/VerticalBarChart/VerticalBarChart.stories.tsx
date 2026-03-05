import type { Meta, StoryObj } from "@storybook/react-vite";
import { VerticalBarChart } from "./index";

const meta: Meta<typeof VerticalBarChart> = {
  title: "Charts/VerticalBarChart",
  component: VerticalBarChart,
};

export default meta;
type Story = StoryObj<typeof VerticalBarChart>;

export const Default: Story = {
  args: {
    title: "Dias com mais vendas",
    labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
    data: [18, 22, 15, 25, 30, 42, 35],
    valueLabel: "vendas",
    valueLabelSingular: "venda",
    bestItemLabel: "Melhor dia",
  },
};
