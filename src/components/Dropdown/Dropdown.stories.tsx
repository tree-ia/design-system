import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown } from "./index";
import React, { useState } from "react";
import { Filter } from "lucide-react";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["default", "underline", "simple", "compact"],
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const options = [
  { value: "opt1", label: "Opção 1" },
  { value: "opt2", label: "Opção 2" },
  { value: "opt3", label: "Opção 3" },
  { value: "opt4", label: "Opção 4" },
];

export const Default: Story = {
  args: {
    options,
    placeholder: "Selecione...",
    onChange: () => {},
  },
};

export const WithLabel: Story = {
  args: {
    options,
    label: "Status",
    placeholder: "Selecione um status",
    onChange: () => {},
  },
};

export const WithIcon: Story = {
  args: {
    options,
    placeholder: "Filtrar por...",
    icon: React.createElement(Filter, { className: "h-4 w-4" }),
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    options,
    label: "Campo obrigatório",
    error: "Este campo é obrigatório",
    onChange: () => {},
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("opt1");
    return React.createElement(Dropdown, {
      options,
      value,
      onChange: setValue,
      label: "Dropdown controlado",
    });
  },
};

export const Variants: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex flex-col gap-4 max-w-xs" },
      React.createElement(Dropdown, {
        options,
        variant: "default",
        placeholder: "Default",
        onChange: () => {},
      }),
      React.createElement(Dropdown, {
        options,
        variant: "underline",
        placeholder: "Underline",
        onChange: () => {},
      }),
      React.createElement(Dropdown, {
        options,
        variant: "simple",
        placeholder: "Simple",
        onChange: () => {},
      }),
      React.createElement(Dropdown, {
        options,
        variant: "compact",
        placeholder: "Compact",
        onChange: () => {},
      }),
    ),
};
