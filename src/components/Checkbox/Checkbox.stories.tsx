import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./index";
import React, { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

function CheckboxDemo(props: Partial<React.ComponentProps<typeof Checkbox>>) {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ padding: 32, background: props.primaryColor === "#37A501" ? "#ffffff" : "#faf3e1", borderRadius: 12 }}>
      <Checkbox
        label="Lembrar conta"
        checked={checked}
        onChange={setChecked}
        {...props}
      />
    </div>
  );
}

/** Eai Garcom theme — orange on cream background */
export const EaiGarcom: Story = {
  render: () => <CheckboxDemo primaryColor="#ff521d" />,
};

/** Eai Garcom checked state */
export const EaiGarcomChecked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <div style={{ padding: 32, background: "#faf3e1", borderRadius: 12 }}>
        <Checkbox
          label="Lembrar conta"
          checked={checked}
          onChange={setChecked}
          primaryColor="#ff521d"
        />
      </div>
    );
  },
};

/** Meu Construtor theme — green on white */
export const MeuConstrutor: Story = {
  render: () => <CheckboxDemo primaryColor="#37A501" />,
};

/** Meu Construtor checked */
export const MeuConstrutorChecked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <div style={{ padding: 32, background: "#ffffff", borderRadius: 12 }}>
        <Checkbox
          label="Lembrar conta"
          checked={checked}
          onChange={setChecked}
          primaryColor="#37A501"
        />
      </div>
    );
  },
};

/** Small size */
export const Small: Story = {
  render: () => <CheckboxDemo size="sm" primaryColor="#ff521d" />,
};

/** Large size */
export const Large: Story = {
  render: () => <CheckboxDemo size="lg" primaryColor="#ff521d" />,
};

/** All sizes side by side */
export const AllSizes: Story = {
  render: () => {
    const [sm, setSm] = useState(true);
    const [md, setMd] = useState(true);
    const [lg, setLg] = useState(true);
    return (
      <div style={{ padding: 32, background: "#faf3e1", borderRadius: 12, display: "flex", flexDirection: "column", gap: 20 }}>
        <Checkbox label="Small (sm)" checked={sm} onChange={setSm} size="sm" primaryColor="#ff521d" />
        <Checkbox label="Medium (md)" checked={md} onChange={setMd} size="md" primaryColor="#ff521d" />
        <Checkbox label="Large (lg)" checked={lg} onChange={setLg} size="lg" primaryColor="#ff521d" />
      </div>
    );
  },
};

/** Disabled states */
export const Disabled: Story = {
  render: () => (
    <div style={{ padding: 32, background: "#faf3e1", borderRadius: 12, display: "flex", flexDirection: "column", gap: 16 }}>
      <Checkbox label="Desabilitado (unchecked)" checked={false} disabled primaryColor="#ff521d" />
      <Checkbox label="Desabilitado (checked)" checked disabled primaryColor="#ff521d" />
    </div>
  ),
};

/** Purple theme */
export const PurpleTheme: Story = {
  render: () => <CheckboxDemo primaryColor="#8B5CF6" />,
};

/** Blue theme */
export const BlueTheme: Story = {
  render: () => <CheckboxDemo primaryColor="#3B82F6" />,
};
