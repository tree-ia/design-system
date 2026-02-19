import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeStatus } from "./index";
import React from "react";

const meta: Meta<typeof BadgeStatus> = {
  title: "Components/BadgeStatus",
  component: BadgeStatus,
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "warning", "danger", "info", "neutral"],
    },
    size: { control: "select", options: ["sm", "md"] },
    label: { control: "text" },
    color: { control: "color" },
    bgColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof BadgeStatus>;

export const Success: Story = {
  args: { label: "Concluído", variant: "success" },
};

export const Warning: Story = {
  args: { label: "Pendente", variant: "warning" },
};

export const Danger: Story = {
  args: { label: "Cancelado", variant: "danger" },
};

export const Info: Story = {
  args: { label: "Em andamento", variant: "info" },
};

export const Neutral: Story = {
  args: { label: "Rascunho", variant: "neutral" },
};

export const SmallSize: Story = {
  args: { label: "Ativo", variant: "success", size: "sm" },
};

export const CustomColors: Story = {
  args: {
    label: "Personalizado",
    color: "#7c3aed",
    bgColor: "#ede9fe",
  },
};

export const AllVariants: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex flex-wrap items-center gap-3" },
      React.createElement(BadgeStatus, { label: "Concluído", variant: "success" }),
      React.createElement(BadgeStatus, { label: "Pendente", variant: "warning" }),
      React.createElement(BadgeStatus, { label: "Cancelado", variant: "danger" }),
      React.createElement(BadgeStatus, { label: "Em andamento", variant: "info" }),
      React.createElement(BadgeStatus, { label: "Rascunho", variant: "neutral" }),
    ),
};

export const OrderStatusExample: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex flex-wrap items-center gap-3" },
      React.createElement(BadgeStatus, { label: "Confirmado", color: "#2563eb", bgColor: "#eff6ff" }),
      React.createElement(BadgeStatus, { label: "Em preparo", color: "#7c3aed", bgColor: "#f5f3ff" }),
      React.createElement(BadgeStatus, { label: "Pronto", variant: "success" }),
      React.createElement(BadgeStatus, { label: "Em entrega", color: "#4f46e5", bgColor: "#eef2ff" }),
      React.createElement(BadgeStatus, { label: "Concluído", variant: "success" }),
      React.createElement(BadgeStatus, { label: "Cancelado", variant: "danger" }),
    ),
};
