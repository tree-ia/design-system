import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./index";
import React from "react";
import { Plus, Trash2, Download } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Salvar",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Cancelar",
    variant: "secondary",
  },
};

export const Danger: Story = {
  args: {
    children: "Excluir",
    variant: "danger",
  },
};

export const Ghost: Story = {
  args: {
    children: "Fechar",
    variant: "ghost",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Adicionar",
    icon: React.createElement(Plus, { className: "h-4 w-4" }),
  },
};

export const IconRight: Story = {
  args: {
    children: "Download",
    icon: React.createElement(Download, { className: "h-4 w-4" }),
    iconPosition: "right",
  },
};

export const IconOnly: Story = {
  args: {
    icon: React.createElement(Trash2, { className: "h-4 w-4" }),
    variant: "danger",
    "aria-label": "Excluir item",
  },
};

export const Loading: Story = {
  args: {
    children: "Salvando",
    isLoading: true,
  },
};

export const AllVariants: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex flex-wrap gap-4" },
      React.createElement(Button, { variant: "primary" }, "Primary"),
      React.createElement(Button, { variant: "secondary" }, "Secondary"),
      React.createElement(Button, { variant: "danger" }, "Danger"),
      React.createElement(Button, { variant: "ghost" }, "Ghost"),
    ),
};

export const AllSizes: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex items-center gap-4" },
      React.createElement(Button, { size: "sm" }, "Small"),
      React.createElement(Button, { size: "md" }, "Medium"),
      React.createElement(Button, { size: "lg" }, "Large"),
    ),
};
