import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./index";
import React, { useState } from "react";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  argTypes: {
    locale: { control: "select", options: ["pt", "en"] },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState({ start: null as Date | null, end: null as Date | null });
    return React.createElement(DateRangePicker, {
      value,
      onChange: setValue,
    });
  },
};

export const WithPreselectedRange: Story = {
  render: () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const [value, setValue] = useState({ start: weekAgo, end: today });
    return React.createElement(DateRangePicker, {
      value,
      onChange: setValue,
    });
  },
};

export const EnglishLocale: Story = {
  render: () => {
    const [value, setValue] = useState({ start: null as Date | null, end: null as Date | null });
    return React.createElement(DateRangePicker, {
      value,
      onChange: setValue,
      locale: "en",
    });
  },
};
