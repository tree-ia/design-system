import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeSwitcher } from "./index";
import React from "react";

const meta: Meta<typeof ThemeSwitcher> = {
  title: "Components/ThemeSwitcher",
  component: ThemeSwitcher,
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {
  args: {},
};

export const InContext: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex items-center gap-4" },
      React.createElement(
        "span",
        { className: "text-sm text-gray-700 dark:text-gray-300" },
        "Alternar tema:",
      ),
      React.createElement(ThemeSwitcher),
    ),
};
