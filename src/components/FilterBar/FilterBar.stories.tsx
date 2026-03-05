import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar } from "./index";
import React from "react";

const meta: Meta<typeof FilterBar> = {
  title: "Components/FilterBar",
  component: FilterBar,
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const SearchOnly: Story = {
  args: {
    searchValue: "",
    onSearchChange: () => {},
    searchPlaceholder: "Buscar pedidos...",
  },
};

export const WithFilters: Story = {
  render: () =>
    React.createElement(FilterBar, {
      searchValue: "",
      onSearchChange: () => {},
      searchPlaceholder: "Buscar...",
      children: [
        React.createElement(
          "select",
          {
            key: "status",
            className: "h-10 rounded-md border border-gray-300 px-3 text-sm",
          },
          React.createElement("option", null, "Todos os status"),
          React.createElement("option", null, "Pendente"),
          React.createElement("option", null, "Concluído"),
        ),
        React.createElement(
          "select",
          {
            key: "category",
            className: "h-10 rounded-md border border-gray-300 px-3 text-sm",
          },
          React.createElement("option", null, "Todas as categorias"),
          React.createElement("option", null, "Pizzas"),
          React.createElement("option", null, "Bebidas"),
        ),
      ],
      actions: React.createElement(
        "button",
        {
          className: "h-10 px-4 bg-green-600 text-white rounded-md text-sm font-medium",
        },
        "Exportar",
      ),
    }),
};
