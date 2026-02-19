import type { Meta, StoryObj } from "@storybook/react-vite";
import { Title } from "./index";
import React from "react";

const meta: Meta<typeof Title> = {
  title: "Components/Title",
  component: Title,
  argTypes: {
    level: { control: "select", options: [1, 2, 3, 4, 5, 6] },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold", "extrabold"],
    },
    align: { control: "select", options: ["left", "center", "right"] },
    color: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Title>;

export const Default: Story = {
  args: {
    children: "Título Principal",
    level: 1,
  },
};

export const H2: Story = {
  args: {
    children: "Subtítulo",
    level: 2,
  },
};

export const H3: Story = {
  args: {
    children: "Seção",
    level: 3,
  },
};

export const CustomSize: Story = {
  args: {
    children: "Tamanho personalizado",
    level: 2,
    size: "xl",
  },
};

export const Centered: Story = {
  args: {
    children: "Título Centralizado",
    level: 1,
    align: "center",
  },
};

export const AllLevels: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "space-y-4" },
      React.createElement(Title, { level: 1 }, "Heading 1"),
      React.createElement(Title, { level: 2 }, "Heading 2"),
      React.createElement(Title, { level: 3 }, "Heading 3"),
      React.createElement(Title, { level: 4 }, "Heading 4"),
      React.createElement(Title, { level: 5 }, "Heading 5"),
      React.createElement(Title, { level: 6 }, "Heading 6"),
    ),
};

export const AllWeights: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "space-y-2" },
      React.createElement(Title, { level: 3, weight: "normal" }, "Normal"),
      React.createElement(Title, { level: 3, weight: "medium" }, "Medium"),
      React.createElement(Title, { level: 3, weight: "semibold" }, "Semibold"),
      React.createElement(Title, { level: 3, weight: "bold" }, "Bold"),
      React.createElement(Title, { level: 3, weight: "extrabold" }, "Extrabold"),
    ),
};
