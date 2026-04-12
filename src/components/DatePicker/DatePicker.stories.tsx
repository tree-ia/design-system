import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./index";
import React, { useState } from "react";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  argTypes: {
    locale: { control: "select", options: ["pt", "en"] },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return React.createElement(DatePicker, {
      value,
      onChange: setValue,
    });
  },
};

export const WithPreselectedDate: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date());
    return React.createElement(DatePicker, {
      value,
      onChange: setValue,
    });
  },
};

export const WithMaxDateToday: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return React.createElement(DatePicker, {
      value,
      onChange: setValue,
      maxDate: new Date(),
    });
  },
};

export const WithMinAndMaxDate: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const weekAhead = new Date();
    weekAhead.setDate(today.getDate() + 7);
    return React.createElement(DatePicker, {
      value,
      onChange: setValue,
      minDate: weekAgo,
      maxDate: weekAhead,
    });
  },
};

export const EnglishLocale: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return React.createElement(DatePicker, {
      value,
      onChange: setValue,
      locale: "en",
    });
  },
};
