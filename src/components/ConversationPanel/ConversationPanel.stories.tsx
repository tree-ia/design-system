import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import {
  ConversationComposer,
  ConversationLayout,
  ConversationPanelProps,
  ConversationPreviewCard,
  ConversationSupportActions,
} from "./index";

const meta: Meta<typeof ConversationLayout> = {
  title: "Components/ConversationLayout",
  component: ConversationLayout,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ConversationLayout>;

const conversations = [
  {
    id: "ana",
    participant: {
      id: "ana",
      name: "Ana Martins",
      phone: "+55 11 99999-1010",
    },
    lastMessage: "Preciso falar com alguem sobre a etapa da obra.",
    lastMessageAt: new Date(),
    messageCount: 24,
    unreadCount: 3,
    supportStatus: "requested" as const,
  },
  {
    id: "bruno",
    participant: {
      id: "bruno",
      name: "Bruno Costa",
      phone: "+55 11 98888-2020",
    },
    lastMessage: "Obrigado, vou enviar o comprovante.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 45),
    messageCount: 18,
    supportStatus: "active" as const,
    supportLabel: "Em suporte",
  },
  {
    id: "carla",
    participant: {
      id: "carla",
      name: "Carla Nogueira",
      email: "carla@email.com",
    },
    lastMessage: "Quero entender melhor o contrato.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    messageCount: 9,
  },
];

const messages = [
  {
    id: "m1",
    direction: "inbound" as const,
    authorLabel: "Cliente",
    content: "Oi, preciso falar com alguem sobre a etapa da obra.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    id: "m2",
    direction: "outbound" as const,
    authorLabel: "IA",
    content:
      "Claro. Ja localizei sua obra e posso te encaminhar para um operador.",
    createdAt: new Date(Date.now() - 1000 * 60 * 11),
  },
  {
    id: "unread",
    direction: "inbound" as const,
    authorLabel: "Cliente",
    content: "Consegue verificar agora?",
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "event",
    direction: "system" as const,
    kind: "event" as const,
    eventLabel: "Novo modelo atribuido",
    eventDescription: "Modelo de atendimento alterado pelo admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "m3",
    direction: "outbound" as const,
    authorLabel: "Operador",
    content: "Ana, vou assumir por aqui e conferir com o time de obras.",
    createdAt: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: "file",
    direction: "inbound" as const,
    kind: "file" as const,
    authorLabel: "Cliente",
    media: {
      url: "#",
      fileName: "comprovante.pdf",
      mimeType: "application/pdf",
    },
    createdAt: new Date(Date.now() - 1000 * 60),
  },
];

function ConversationDemo(args: Partial<ConversationPanelProps>) {
  const [selectedId, setSelectedId] = useState("ana");
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const selected = conversations.find((item) => item.id === selectedId);

  return (
    <div className="h-screen bg-[var(--dashboard-background,#f2f2f2)] p-6">
      <ConversationLayout
        title="Conversas do WhatsApp"
        subtitle="Visualize e gerencie conversas entre clientes e o agente de IA."
        connected
        conversations={conversations.filter((item) =>
          item.participant.name.toLowerCase().includes(search.toLowerCase()),
        )}
        selectedId={selectedId}
        selectedParticipant={selected?.participant}
        messages={selectedId === "ana" ? messages : messages.slice(0, 2)}
        stats={{ total: 24, inbound: 13, outbound: 11 }}
        searchValue={search}
        onSearchChange={setSearch}
        onClearSearch={() => setSearch("")}
        onSelectConversation={(item) => setSelectedId(item.id)}
        onBack={() => setSelectedId("")}
        supportStatus={selected?.supportStatus}
        supportLabel={selected?.supportLabel}
        unreadMessageId="unread"
        threadActions={
          <ConversationSupportActions
            status={selected?.supportStatus}
            stats={{ total: 24, inbound: 13, outbound: 11 }}
            reason={selected?.supportStatus === "requested" ? "Motivo: etapa da obra" : undefined}
            onStart={() => undefined}
            onEnd={() => undefined}
            onEndSilent={() => undefined}
          />
        }
        composer={
          <ConversationComposer
            value={value}
            onChange={setValue}
            onSend={() => setValue("")}
            onFileSelect={() => undefined}
            status={selected?.supportStatus === "active" ? "active" : "ai"}
          />
        }
        {...args}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <ConversationDemo {...args} />,
};

export const LoadingThread: Story = {
  render: (args) => <ConversationDemo {...args} threadLoading />,
};

export const ExpiredComposer: Story = {
  render: (args) => (
    <ConversationDemo
      {...args}
      composer={
        <ConversationComposer
          value=""
          onChange={() => undefined}
          onSend={() => undefined}
          status="expired"
        />
      }
    />
  ),
};

export const DashboardRecentMessages: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--dashboard-background,#f2f2f2)] p-6">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {conversations.map((item) => (
          <ConversationPreviewCard
            key={item.id}
            item={item}
            variant="card"
            onSelect={() => undefined}
          />
        ))}
      </div>
    </div>
  ),
};

export const CompactRecentMessages: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--dashboard-background,#f2f2f2)] p-6">
      <div className="mx-auto max-w-md space-y-3">
        {conversations.map((item) => (
          <ConversationPreviewCard
            key={item.id}
            item={item}
            variant="compact"
            showContact={false}
            onSelect={() => undefined}
          />
        ))}
      </div>
    </div>
  ),
};
