import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { TableOfContents, type TocItem } from "./index";

const meta: Meta<typeof TableOfContents> = {
  title: "Components/TableOfContents",
  component: TableOfContents,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    title: { control: "text" },
    showThumb: { control: "boolean" },
    single: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof TableOfContents>;

const items: TocItem[] = [
  { url: "#introducao", title: "Introdução", depth: 1 },
  { url: "#principios", title: "Princípios", depth: 1 },
  { url: "#fundamentos", title: "Fundamentos", depth: 1 },
  { url: "#fundamentos-cores", title: "Cores", depth: 2 },
  { url: "#fundamentos-tipografia", title: "Tipografia", depth: 2 },
  { url: "#fundamentos-espacamento", title: "Espaçamento", depth: 2 },
  { url: "#componentes", title: "Componentes", depth: 1 },
  { url: "#componentes-button", title: "Button", depth: 2 },
  { url: "#componentes-input", title: "Input", depth: 2 },
  { url: "#a11y", title: "Acessibilidade", depth: 1 },
];

const longLorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros vitae justo " +
  "tristique aliquet. Curabitur tincidunt, lacus eu commodo varius, magna lectus tincidunt " +
  "felis, nec tristique nibh velit non urna. Integer consectetur ipsum sit amet velit blandit, " +
  "ac vulputate magna feugiat. Sed lacinia ipsum quis dolor pellentesque, sit amet finibus " +
  "tellus pretium. Nullam fringilla velit eget orci porta, sit amet ultrices nibh tincidunt.";

function DemoPage({
  args,
}: {
  args: React.ComponentProps<typeof TableOfContents>;
}) {
  return (
    <div className="min-h-screen p-8 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 max-w-6xl mx-auto">
      <article className="prose max-w-none">
        {items.map((item) => {
          const id = item.url.slice(1);
          const Tag = (item.depth === 1 ? "h2" : "h3") as "h2" | "h3";
          return (
            <section key={id} className="mb-16">
              <Tag id={id} className="scroll-m-20 text-xl font-semibold mb-3">
                {item.title}
              </Tag>
              <p className="text-sm leading-relaxed">{longLorem}</p>
              <p className="text-sm leading-relaxed mt-3">{longLorem}</p>
            </section>
          );
        })}
      </article>
      <aside className="hidden lg:block">
        <div className="sticky top-8">
          <TableOfContents {...args} items={items} />
        </div>
      </aside>
    </div>
  );
}

export const Default: Story = {
  args: {
    title: "Nesta página",
    showThumb: true,
    single: false,
  },
  render: (args) => <DemoPage args={args} />,
};

export const WithoutThumb: Story = {
  args: {
    title: "Nesta página",
    showThumb: false,
    single: false,
  },
  render: (args) => <DemoPage args={args} />,
};

export const SingleActive: Story = {
  args: {
    title: "Nesta página",
    showThumb: true,
    single: true,
  },
  render: (args) => <DemoPage args={args} />,
};
