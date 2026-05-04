import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { SocialIcon, socialIconNames } from "./index";

const meta: Meta<typeof SocialIcon> = {
  title: "Components/SocialIcon",
  component: SocialIcon,
  argTypes: {
    name: {
      control: "select",
      options: socialIconNames,
    },
    size: {
      control: "number",
    },
  },
  args: {
    name: "instagram",
    size: 24,
  },
};

export default meta;
type Story = StoryObj<typeof SocialIcon>;

export const Default: Story = {};

export const AllIcons: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex items-center gap-4 text-[var(--dashboard-text-primary,#172418)]" },
      socialIconNames.map((name) =>
        React.createElement(
          "div",
          {
            key: name,
            className:
              "flex h-12 w-12 items-center justify-center rounded-full bg-[var(--dashboard-primary,#12B2CA)]/10 text-[var(--dashboard-primary,#12B2CA)]",
            title: name,
          },
          React.createElement(SocialIcon, { name, size: 24 }),
        ),
      ),
    ),
};
