import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "./index";
import React from "react";

const meta: Meta<typeof Callout> = {
  title: "Components/Callout",
  component: Callout,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "tip", "danger"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "Informação",
    children: "Este endpoint requer autenticação via API Key no header x-api-key.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Atenção",
    children:
      "A API Key é exibida apenas uma vez no momento da criação. Armazene-a em local seguro.",
  },
};

export const Tip: Story = {
  args: {
    variant: "tip",
    title: "Dica",
    children:
      "Use o webhook subscription.trial_ending para notificar seus usuários 3 dias antes do trial expirar.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Importante",
    children:
      "Nunca exponha sua API Key no frontend. Todas as chamadas devem ser feitas pelo backend.",
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: "info",
    children: "Callout sem título, apenas com conteúdo inline.",
  },
};

export const WithReactContent: Story = {
  args: {
    variant: "tip",
    title: "Múltiplos formatos",
    children: (
      <div>
        <p>Suporta conteúdo React arbitrário:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Listas</li>
          <li>Links</li>
          <li>Componentes customizados</li>
        </ul>
      </div>
    ),
  },
};
