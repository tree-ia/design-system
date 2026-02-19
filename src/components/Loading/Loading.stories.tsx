import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loading } from "./index";

const meta: Meta<typeof Loading> = {
  title: "Components/Loading",
  component: Loading,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: { control: "select", options: ["spinner", "border"] },
    fullscreen: { control: "boolean" },
    text: { control: "text" },
    textColor: { control: "color" },
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const WithText: Story = {
  args: {
    size: "lg",
    text: "Carregando dados...",
  },
};

export const CustomColor: Story = {
  args: {
    size: "md",
    color: "#ff521d",
    text: "Processando...",
  },
};

export const BorderVariant: Story = {
  args: {
    size: "md",
    variant: "border",
  },
};

export const BorderWithText: Story = {
  args: {
    size: "lg",
    variant: "border",
    text: "Carregando...",
  },
};

export const CustomTextColor: Story = {
  args: {
    size: "md",
    text: "Aguarde...",
    textColor: "#6366f1",
  },
};
