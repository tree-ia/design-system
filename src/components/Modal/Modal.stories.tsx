import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./index";
import { Button } from "../Button";
import React, { useState } from "react";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large", "largeXl", "extraLarge"],
    },
    closeOnEscape: { control: "boolean" },
    closeOnOverlayClick: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Button,
        { onClick: () => setIsOpen(true) },
        "Abrir Modal",
      ),
      React.createElement(
        Modal,
        {
          isOpen,
          onClose: () => setIsOpen(false),
          title: "Título do Modal",
        },
        React.createElement("p", null, "Conteúdo do modal aqui."),
      ),
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Button,
        { onClick: () => setIsOpen(true) },
        "Abrir Modal com Footer",
      ),
      React.createElement(
        Modal,
        {
          isOpen,
          onClose: () => setIsOpen(false),
          onSave: () => {
            alert("Salvo!");
            setIsOpen(false);
          },
          title: "Editar registro",
          showFooter: true,
          saveButtonText: "Confirmar",
          cancelButtonText: "Descartar",
        },
        React.createElement("p", null, "Formulário de edição aqui."),
      ),
    );
  },
};

export const DangerAction: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Button,
        { variant: "danger", onClick: () => setIsOpen(true) },
        "Excluir",
      ),
      React.createElement(
        Modal,
        {
          isOpen,
          onClose: () => setIsOpen(false),
          onSave: () => setIsOpen(false),
          title: "Confirmar exclusão",
          showFooter: true,
          saveButtonText: "Excluir",
          saveButtonVariant: "danger",
          size: "small",
        },
        React.createElement(
          "p",
          null,
          "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
        ),
      ),
    );
  },
};
