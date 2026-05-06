import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { IPhoneMockup } from "./index";

const meta: Meta<typeof IPhoneMockup> = {
  title: "Components/IPhoneMockup",
  component: IPhoneMockup,
  argTypes: {
    screenType: {
      control: "select",
      options: ["island", "notch", "legacy"],
    },
    isLandscape: { control: "boolean" },
    frameOnly: { control: "boolean" },
    hideStatusBar: { control: "boolean" },
    hideNavBar: { control: "boolean" },
    transparentNavBar: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof IPhoneMockup>;

export const Island: Story = {
  args: {
    screenWidth: 280,
    screenType: "island",
    frameColor: "#0a0d12",
    statusbarColor: "#f8fafc",
    hideNavBar: false,
  },
  render: (args) =>
    React.createElement(
      IPhoneMockup,
      args,
      React.createElement(
        "div",
        {
          className:
            "flex h-full w-full items-center justify-center bg-slate-950 text-sm font-semibold text-white",
        },
        "Conteúdo do app",
      ),
    ),
};

export const Variants: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex flex-wrap items-start gap-8" },
      React.createElement(
        IPhoneMockup,
        {
          screenWidth: 220,
          screenType: "island",
          frameColor: "#0a0d12",
          statusbarColor: "#111827",
          hideNavBar: true,
        },
        React.createElement("div", {
          className: "h-full w-full bg-gradient-to-b from-emerald-100 to-white",
        }),
      ),
      React.createElement(
        IPhoneMockup,
        {
          screenWidth: 220,
          screenType: "notch",
          frameColor: "#111827",
          statusbarColor: "#e5e7eb",
        },
        React.createElement("div", {
          className: "h-full w-full bg-gradient-to-b from-sky-100 to-white",
        }),
      ),
      React.createElement(
        IPhoneMockup,
        {
          screenWidth: 210,
          screenType: "legacy",
          frameColor: "#111827",
          statusbarColor: "#f9fafb",
        },
        React.createElement("div", {
          className: "h-full w-full bg-gradient-to-b from-amber-100 to-white",
        }),
      ),
    ),
};
