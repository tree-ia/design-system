import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./index";
import React from "react";

const meta: Meta<typeof CodeBlock> = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  argTypes: {
    language: {
      control: "select",
      options: ["typescript", "javascript", "json", "bash", "http"],
    },
    showLineNumbers: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {
  args: {
    code: `const response = await fetch('/api/v1/subscriptions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'raizes_live_...',
  },
  body: JSON.stringify({
    externalUserId: 'user_123',
    planId: 'plan_abc',
  }),
});`,
    language: "typescript",
  },
};

export const WithFilename: Story = {
  args: {
    code: `{
  "event": "subscription.activated",
  "tenant": "meu-construtor",
  "timestamp": "2026-04-05T09:00:00.000Z",
  "data": {
    "subscriptionId": "sub_123",
    "status": "ACTIVE"
  }
}`,
    language: "json",
    filename: "webhook-payload.json",
  },
};

export const WithLineNumbers: Story = {
  args: {
    code: `import crypto from 'crypto';

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}`,
    language: "javascript",
    filename: "verify-webhook.js",
    showLineNumbers: true,
  },
};

export const Bash: Story = {
  args: {
    code: `curl -X POST https://api.raizes.com/api/v1/subscriptions \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: raizes_live_..." \\
  -d '{"externalUserId": "user_123"}'`,
    language: "bash",
  },
};

export const HTTP: Story = {
  args: {
    code: `POST /api/v1/subscriptions HTTP/1.1
Host: api.raizes.com
Content-Type: application/json
x-api-key: raizes_live_...`,
    language: "http",
  },
};
