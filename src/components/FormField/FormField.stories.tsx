import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./index";
import React, { useState } from "react";

const meta: Meta<typeof FormField> = {
  title: "Components/FormField",
  component: FormField,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel"],
    },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: "Nome completo",
    name: "name",
    value: "",
    onChange: () => {},
    placeholder: "Digite seu nome",
  },
};

export const Required: Story = {
  args: {
    label: "Email",
    name: "email",
    type: "email",
    value: "",
    onChange: () => {},
    required: true,
    placeholder: "seu@email.com",
  },
};

export const WithError: Story = {
  args: {
    label: "Senha",
    name: "password",
    type: "password",
    value: "123",
    onChange: () => {},
    error: "A senha deve ter pelo menos 8 caracteres",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Campo bloqueado",
    name: "locked",
    value: "Valor fixo",
    onChange: () => {},
    disabled: true,
  },
};

export const FormExample: Story = {
  render: () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const update = (field: string) => (value: string) =>
      setForm((prev) => ({ ...prev, [field]: value }));

    return React.createElement(
      "div",
      { className: "max-w-md space-y-4" },
      React.createElement(FormField, {
        label: "Nome",
        name: "name",
        value: form.name,
        onChange: update("name"),
        required: true,
        placeholder: "Seu nome",
      }),
      React.createElement(FormField, {
        label: "Email",
        name: "email",
        type: "email",
        value: form.email,
        onChange: update("email"),
        required: true,
        placeholder: "seu@email.com",
      }),
      React.createElement(FormField, {
        label: "Telefone",
        name: "phone",
        type: "tel",
        value: form.phone,
        onChange: update("phone"),
        placeholder: "(11) 99999-9999",
      }),
    );
  },
};
