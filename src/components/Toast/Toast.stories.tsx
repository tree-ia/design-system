import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "./index";
import { Button } from "../Button";
import React, { useState } from "react";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  argTypes: {
    type: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
    duration: { control: "number" },
    showProgress: { control: "boolean" },
  },
  decorators: [
    (Story) =>
      React.createElement(
        "div",
        {
          className:
            "fixed w-full max-w-[400px] px-4 z-50 top-4 left-1/2 -translate-x-1/2 sm:top-5 sm:right-4 sm:left-auto sm:translate-x-0",
        },
        React.createElement(Story),
      ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    title: "Registro salvo!",
    subtitle: "Os dados foram salvos com sucesso.",
    type: "success",
    duration: 0,
    onClose: () => {},
  },
};

export const Error: Story = {
  args: {
    title: "Erro ao salvar",
    subtitle: "Não foi possível salvar os dados. Tente novamente.",
    type: "error",
    duration: 0,
    onClose: () => {},
  },
};

export const Warning: Story = {
  args: {
    title: "Atenção",
    subtitle: "Sua sessão expira em 5 minutos.",
    type: "warning",
    duration: 0,
    onClose: () => {},
  },
};

export const Info: Story = {
  args: {
    title: "Atualização disponível",
    subtitle: "Uma nova versão do sistema está disponível.",
    type: "info",
    duration: 0,
    onClose: () => {},
  },
};

export const WithProgress: Story = {
  args: {
    title: "Registro salvo!",
    subtitle: "Os dados foram salvos com sucesso.",
    type: "success",
    duration: 4000,
    showProgress: true,
    onClose: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      {
        id: number;
        type: "success" | "error" | "warning" | "info";
        title: string;
        subtitle: string;
      }[]
    >([]);
    let counter = 0;

    const types = [
      {
        type: "success" as const,
        title: "Sucesso!",
        subtitle: "Operação realizada com sucesso.",
      },
      {
        type: "error" as const,
        title: "Erro!",
        subtitle: "Algo deu errado. Tente novamente.",
      },
      {
        type: "warning" as const,
        title: "Atenção!",
        subtitle: "Verifique os dados informados.",
      },
      {
        type: "info" as const,
        title: "Informação",
        subtitle: "Processo em andamento.",
      },
    ];

    const addToast = (typeIndex: number) => {
      const { type, title, subtitle } = types[typeIndex];
      setToasts((prev) => [...prev, { id: Date.now(), type, title, subtitle }]);
    };

    const removeToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return React.createElement(
      "div",
      { className: "space-y-4" },
      React.createElement(
        "div",
        { className: "flex flex-wrap gap-2" },
        React.createElement(
          Button,
          { variant: "primary", size: "sm", onClick: () => addToast(0) },
          "Success",
        ),
        React.createElement(
          Button,
          { variant: "danger", size: "sm", onClick: () => addToast(1) },
          "Error",
        ),
        React.createElement(
          Button,
          { variant: "secondary", size: "sm", onClick: () => addToast(2) },
          "Warning",
        ),
        React.createElement(
          Button,
          { variant: "ghost", size: "sm", onClick: () => addToast(3) },
          "Info",
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "fixed w-full max-w-[400px] px-4 z-50 top-4 left-1/2 -translate-x-1/2 sm:top-5 sm:right-4 sm:left-auto sm:translate-x-0 flex flex-col gap-2",
        },
        toasts.map((toast) =>
          React.createElement(Toast, {
            key: toast.id,
            title: toast.title,
            subtitle: toast.subtitle,
            type: toast.type,
            duration: 4000,
            onClose: () => removeToast(toast.id),
          }),
        ),
      ),
    );
  },
};
