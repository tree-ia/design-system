import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { WhatsAppMockup, type WhatsAppMockupMessage } from "./index";

const messages: WhatsAppMockupMessage[] = [
  {
    id: "pedido-audio",
    direction: "outgoing",
    type: "audio",
    text: "Preciso de 80 sacos de cimento CP II para a obra Jardim Europa, entrega até sexta.",
    duration: "0:23",
    time: "14:32",
    read: true,
  },
  {
    id: "resposta",
    direction: "incoming",
    type: "text",
    text: "Pedido entendido. Vou enviar para cotação com fornecedores aprovados.",
    time: "14:33",
  },
  {
    id: "financeiro",
    direction: "outgoing",
    type: "text",
    text: "Boleto Telhanorte SP, R$ 12.450, NF-e 5467, vence dia 15.",
    time: "15:08",
    read: false,
  },
];

const meta: Meta<typeof WhatsAppMockup> = {
  title: "Components/WhatsAppMockup",
  component: WhatsAppMockup,
  argTypes: {
    profileType: {
      control: "select",
      options: ["business", "personal"],
    },
    theme: {
      control: "select",
      options: ["dark", "light"],
    },
    headerBackgroundColor: { control: "color" },
    profileAvatarBackgroundColor: { control: "color" },
    showComposer: { control: "boolean" },
    showHeaderActions: { control: "boolean" },
    showWallpaper: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof WhatsAppMockup>;

export const Business: Story = {
  args: {
    contactName: "Meu Construtor",
    profileType: "business",
    theme: "dark",
    messages,
    statusTime: "14:32",
  },
};

export const PersonalProfile: Story = {
  args: {
    contactName: "Henrik Marinho",
    profileType: "personal",
    theme: "light",
    messages: [
      {
        direction: "incoming",
        type: "text",
        text: "Fechamos a visita para amanhã cedo?",
        time: "09:14",
      },
      {
        direction: "outgoing",
        type: "text",
        text: "Fechamos sim. Pode ser às 8h30.",
        time: "09:15",
        read: true,
      },
    ],
    statusTime: "09:15",
  },
};

export const CustomMessageContent: Story = {
  render: () =>
    React.createElement(WhatsAppMockup, {
      contactName: "Meu Construtor",
      messages: [
        {
          direction: "incoming",
          type: "custom",
          time: "16:41",
          children: React.createElement(
            "div",
            { className: "grid gap-1.5 text-[10px] leading-snug" },
            React.createElement(
              "p",
              { className: "text-[11px] font-semibold" },
              "Cotação criada",
            ),
            React.createElement(
              "div",
              {
                className:
                  "rounded-md bg-[#008069]/10 px-2 py-1 text-[#008069]",
              },
              "Pedido #PD-0142 enviado para 5 fornecedores.",
            ),
          ),
        },
      ],
    }),
};
