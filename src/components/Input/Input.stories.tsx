import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./index";
import React, { useState } from "react";
import { Search, Eye, EyeOff } from "lucide-react";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    label: { control: "text" },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Digite algo...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "E-mail",
    placeholder: "seu@email.com",
    type: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Nome",
    placeholder: "Seu nome",
    error: "Este campo é obrigatório",
    value: "",
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "Buscar...",
    children: React.createElement(Search, {
      className: "h-4 w-4 text-gray-400",
    }),
  },
};

export const Password: Story = {
  render: () => {
    const [show, setShow] = useState(false);
    const Icon = show ? EyeOff : Eye;
    return React.createElement(Input, {
      type: show ? "text" : "password",
      placeholder: "Sua senha",
      children: React.createElement(Icon, {
        className:
          "h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors",
        onClick: () => setShow((prev) => !prev),
      }),
    });
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Campo desabilitado",
    disabled: true,
  },
};
