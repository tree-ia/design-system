import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Dropdown } from "../components/Dropdown";

const meta: Meta = {
  title: "Design System/Size Alignment",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Demonstração de alinhamento de altura entre componentes de formulário. Botões, inputs e dropdowns do mesmo tamanho devem compartilhar a mesma altura total para alinhar perfeitamente quando usados lado a lado.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const dropdownOptions = [
  { value: "opt1", label: "Opção 1" },
  { value: "opt2", label: "Opção 2" },
  { value: "opt3", label: "Opção 3" },
];

export const Small: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex items-center gap-3" },
      React.createElement(Button, { size: "sm" }, "Button sm"),
      React.createElement(Input, {
        size: "sm",
        placeholder: "Input sm",
        className: "w-48",
      }),
      React.createElement(Dropdown, {
        size: "sm",
        options: dropdownOptions,
        placeholder: "Dropdown sm",
        onChange: () => {},
        className: "w-48",
      }),
    ),
};

export const Medium: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex items-center gap-3" },
      React.createElement(Button, { size: "md" }, "Button md"),
      React.createElement(Input, {
        size: "md",
        placeholder: "Input md",
        className: "w-48",
      }),
      React.createElement(Dropdown, {
        size: "md",
        options: dropdownOptions,
        placeholder: "Dropdown md",
        onChange: () => {},
        className: "w-48",
      }),
    ),
};

export const Large: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex items-center gap-3" },
      React.createElement(Button, { size: "lg" }, "Button lg"),
      React.createElement(Input, {
        size: "lg",
        placeholder: "Input lg",
        className: "w-48",
      }),
      React.createElement(Dropdown, {
        size: "lg",
        options: dropdownOptions,
        placeholder: "Dropdown lg",
        onChange: () => {},
        className: "w-48",
      }),
    ),
};

export const AllSizesComparison: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex flex-col gap-6" },
      React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          { className: "text-xs text-gray-500 mb-1 font-medium" },
          "size=\"sm\" — 32px (h-8)"
        ),
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          React.createElement(Button, { size: "sm" }, "Salvar"),
          React.createElement(Input, { size: "sm", placeholder: "Nome" }),
          React.createElement(Dropdown, {
            size: "sm",
            options: dropdownOptions,
            placeholder: "Status",
            onChange: () => {},
          }),
        ),
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          { className: "text-xs text-gray-500 mb-1 font-medium" },
          "size=\"md\" — 36px (h-9) — padrão"
        ),
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          React.createElement(Button, { size: "md" }, "Salvar"),
          React.createElement(Input, { size: "md", placeholder: "Nome" }),
          React.createElement(Dropdown, {
            size: "md",
            options: dropdownOptions,
            placeholder: "Status",
            onChange: () => {},
          }),
        ),
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          { className: "text-xs text-gray-500 mb-1 font-medium" },
          "size=\"lg\" — 40px (h-10)"
        ),
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          React.createElement(Button, { size: "lg" }, "Salvar"),
          React.createElement(Input, { size: "lg", placeholder: "Nome" }),
          React.createElement(Dropdown, {
            size: "lg",
            options: dropdownOptions,
            placeholder: "Status",
            onChange: () => {},
          }),
        ),
      ),
    ),
};
