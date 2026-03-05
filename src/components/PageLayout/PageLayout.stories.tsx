import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageLayout } from "./index";
import React from "react";

const meta: Meta<typeof PageLayout> = {
  title: "Components/PageLayout",
  component: PageLayout,
  argTypes: {
    contentPadding: { control: "boolean" },
    sidebarCollapsed: { control: "boolean" },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
  args: {
    title: "Dashboard",
    description: "Visão geral do seu negócio",
    children: React.createElement(
      "div",
      { className: "grid grid-cols-3 gap-4" },
      React.createElement(
        "div",
        { className: "bg-white rounded-lg p-6 border border-gray-200" },
        "Card 1",
      ),
      React.createElement(
        "div",
        { className: "bg-white rounded-lg p-6 border border-gray-200" },
        "Card 2",
      ),
      React.createElement(
        "div",
        { className: "bg-white rounded-lg p-6 border border-gray-200" },
        "Card 3",
      ),
    ),
  },
};

export const WithHeaderActions: Story = {
  args: {
    title: "Pedidos",
    description: "Gerencie seus pedidos",
    headerActions: React.createElement(
      "div",
      { className: "flex gap-2" },
      React.createElement(
        "button",
        { className: "px-4 py-2 bg-green-600 text-white rounded-lg text-sm" },
        "Novo Pedido",
      ),
    ),
    children: React.createElement(
      "div",
      { className: "bg-white rounded-lg p-6 border border-gray-200" },
      "Conteúdo da página",
    ),
  },
};

export const NoPadding: Story = {
  args: {
    title: "Mapa de Entrega",
    contentPadding: false,
    children: React.createElement("div", {
      className: "bg-blue-100 h-[400px] flex items-center justify-center",
    }, "Conteúdo sem padding"),
  },
};
