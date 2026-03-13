import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthLayout } from "./index";
import { CodeInput } from "../CodeInput";
import React, { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Resend timer hook
// ---------------------------------------------------------------------------

function useResendTimer(seconds = 60) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const start = useCallback(() => setRemaining(seconds), [seconds]);
  const canResend = remaining <= 0;

  return { remaining, canResend, start };
}

// ---------------------------------------------------------------------------
// ResendCode component
// ---------------------------------------------------------------------------

function ResendCode({
  onResend,
  seconds = 60,
}: {
  onResend?: () => void;
  seconds?: number;
}) {
  const { remaining, canResend, start } = useResendTimer(seconds);

  // Start timer on mount
  useEffect(() => { start(); }, [start]);

  return (
    <div className="text-center mb-1">
      {canResend ? (
        <button
          type="button"
          onClick={() => {
            onResend?.();
            start();
          }}
          className="text-sm font-medium cursor-pointer bg-transparent border-none p-0 hover:underline transition-colors"
          style={{ color: "var(--dashboard-primary, #ff521d)" }}
        >
          Reenviar código
        </button>
      ) : (
        <span className="text-sm text-gray-400">
          Reenviar código em {remaining}s
        </span>
      )}
    </div>
  );
}

const meta: Meta<typeof AuthLayout> = {
  title: "Components/AuthLayout",
  component: AuthLayout,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AuthLayout>;

// ---------------------------------------------------------------------------
// Shared layout props
// ---------------------------------------------------------------------------

const sharedLayout: Partial<React.ComponentProps<typeof AuthLayout>> = {
  background: {
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80",
    overlayOpacity: 0.2,
  },
  cardPosition: "right",
  cardOffsetRight: 256,
  headline: {
    text: "Voce faz tudo pelo seu negocio.",
    highlight: "Nos tambem!",
  },
  branding: {
    logos: [
      <img
        key="dc"
        src="https://placehold.co/140x54/ffffff/ffffff?text=Deu+Certo"
        alt="Deu Certo"
        width={140}
        height={54}
        draggable={false}
      />,
      <img
        key="tree"
        src="https://placehold.co/140x54/ffffff/ffffff?text=TREE.IA"
        alt="Tree IA"
        width={140}
        height={54}
        draggable={false}
      />,
    ],
  },
};

// ---------------------------------------------------------------------------
// Stories — all theme-aware, switch via Storybook toolbar
// ---------------------------------------------------------------------------

/** Login screen */
export const Login: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [remember, setRemember] = useState(false);

    return (
      <AuthLayout
        title="Painel de Controle"
        subtitle="Gerencie seu negocio de forma facil e rapida"
        fields={[
          { name: "email", type: "email", placeholder: "E-mail", required: true },
          { name: "password", type: "password", placeholder: "Senha", required: true },
        ]}
        values={values}
        onFieldChange={(name, value) =>
          setValues((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={() => {
          setLoading(true);
          setError("");
          setTimeout(() => {
            setLoading(false);
            setError("Email ou senha incorretos.");
          }, 1500);
        }}
        submitLabel="Acessar"
        loadingLabel="Entrando..."
        isLoading={loading}
        error={error}
        checkbox={{
          name: "remember",
          label: "Lembrar conta",
          checked: remember,
          onChange: setRemember,
        }}
        secondaryLink={{
          prefix: "Ainda nao tem cadastro?",
          label: "Cadastre-se",
          href: "/criar-conta",
        }}
        {...sharedLayout}
      />
    );
  },
};

/** Create account screen */
export const CreateAccount: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    return (
      <AuthLayout
        title="Criar Conta"
        subtitle="Preencha os dados para cadastrar seu restaurante"
        fields={[
          { name: "fullName", placeholder: "Nome completo", required: true },
          { name: "email", type: "email", placeholder: "E-mail", required: true },
          { name: "phone", type: "tel", placeholder: "Telefone (opcional)" },
          { name: "password", type: "password", placeholder: "Senha", required: true, minLength: 6 },
          { name: "confirmPassword", type: "password", placeholder: "Confirmar senha", required: true, minLength: 6 },
        ]}
        values={values}
        onFieldChange={(name, value) =>
          setValues((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
        submitLabel="Criar conta"
        loadingLabel="Criando conta..."
        isLoading={loading}
        secondaryLink={{
          prefix: "Ja tem uma conta?",
          label: "Entrar",
          href: "/login",
        }}
        {...sharedLayout}
      />
    );
  },
};

/** Forgot password screen */
export const ForgotPassword: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    return (
      <AuthLayout
        title="Recuperar Senha"
        subtitle="Informe seu email para enviarmos um código de recuperação"
        fields={[
          { name: "email", type: "email", placeholder: "E-mail", required: true },
        ]}
        values={values}
        onFieldChange={(name, value) =>
          setValues((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
        submitLabel="Enviar código de recuperação"
        loadingLabel="Enviando..."
        isLoading={loading}
        primaryLink={{ label: "Voltar para o login", href: "/login" }}
        {...sharedLayout}
      />
    );
  },
};

/** Verify code screen — 6-digit OTP */
export const VerifyCode: Story = {
  render: () => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const email = "lucas@tree.ia.br";

    return (
      <AuthLayout
        title="Recuperar senha"
        subtitle={
          <>
            Digite o codigo de 6 digitos enviado para{" "}
            <strong>{email}</strong>
          </>
        }
        titleAlign="center"
        fields={[]}
        values={{}}
        onFieldChange={() => {}}
        onSubmit={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
        submitLabel="Verificar código"
        loadingLabel="Verificando..."
        isLoading={loading}
        headerContent={
          <div className="mb-4">
            <CodeInput
              value={code}
              onChange={setCode}
            />
          </div>
        }
        beforeSubmitContent={
          <ResendCode seconds={60} />
        }
        secondaryLink={{ label: "Voltar para o login", href: "/login" }}
        {...sharedLayout}
      />
    );
  },
};
