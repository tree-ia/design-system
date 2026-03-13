import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeInput } from "./index";
import React, { useState } from "react";

const meta: Meta<typeof CodeInput> = {
  title: "Components/CodeInput",
  component: CodeInput,
};

export default meta;
type Story = StoryObj<typeof CodeInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ padding: 40, background: "#faf3e1", borderRadius: 16 }}>
        <CodeInput value={value} onChange={setValue} />
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#6b7280" }}>
          Valor: &quot;{value}&quot;
        </p>
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState("12345");
    return (
      <div style={{ padding: 40, background: "#faf3e1", borderRadius: 16 }}>
        <CodeInput value={value} onChange={setValue} error />
      </div>
    );
  },
};

export const CustomColor: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ padding: 40, background: "#ffffff", borderRadius: 16 }}>
        <CodeInput value={value} onChange={setValue} primaryColor="#37A501" />
      </div>
    );
  },
};

export const FourDigits: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ padding: 40, background: "#faf3e1", borderRadius: 16 }}>
        <CodeInput value={value} onChange={setValue} length={4} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ padding: 40, background: "#faf3e1", borderRadius: 16 }}>
        <CodeInput value="123456" onChange={() => {}} disabled />
      </div>
    );
  },
};
