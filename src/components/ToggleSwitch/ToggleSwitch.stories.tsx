import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleSwitch } from "./index";
import React, { useState } from "react";

const meta: Meta<typeof ToggleSwitch> = {
  title: "Components/ToggleSwitch",
  component: ToggleSwitch,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Default: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);
    return React.createElement(ToggleSwitch, {
      enabled,
      onChange: setEnabled,
    });
  },
};

export const Enabled: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(true);
    return React.createElement(ToggleSwitch, {
      enabled,
      onChange: setEnabled,
    });
  },
};

export const WithLabel: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);
    return React.createElement(ToggleSwitch, {
      enabled,
      onChange: setEnabled,
      label: "Ativar notificações",
    });
  },
};

export const Disabled: Story = {
  render: () =>
    React.createElement(ToggleSwitch, {
      enabled: false,
      onChange: () => {},
      disabled: true,
      label: "Indisponível",
    }),
};

export const AllSizes: Story = {
  render: () => {
    const [sm, setSm] = useState(true);
    const [md, setMd] = useState(true);
    const [lg, setLg] = useState(true);
    return React.createElement(
      "div",
      { className: "flex items-center gap-6" },
      React.createElement(ToggleSwitch, {
        enabled: sm,
        onChange: setSm,
        size: "sm",
        label: "Small",
      }),
      React.createElement(ToggleSwitch, {
        enabled: md,
        onChange: setMd,
        size: "md",
        label: "Medium",
      }),
      React.createElement(ToggleSwitch, {
        enabled: lg,
        onChange: setLg,
        size: "lg",
        label: "Large",
      }),
    );
  },
};
