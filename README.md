# @tree-ia/design-system

Biblioteca de componentes React compartilhada para os dashboards da Tree IA (EaíGarçom, EaíPrefeito, MeuConstrutor, etc.). Todos os componentes são temáveis via CSS custom properties, construídos com Tailwind CSS v4 e publicados no GitHub Packages.

## Instalação

### 1. Configurar o registry

Crie um `.npmrc` na raiz do projeto consumidor com o registry e o token de autenticação:

```
@tree-ia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=SEU_GITHUB_TOKEN
```

Substitua `SEU_GITHUB_TOKEN` por um Personal Access Token (classic) com o scope `read:packages`.

### 2. Instalar

```bash
npm install @tree-ia/design-system
```

### Peer dependencies

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "tailwindcss": "^4.0.0"
}
```

---

## Setup

### 1. Configurar o Tailwind CSS (obrigatório)

Os componentes usam classes do Tailwind CSS. Como a lib não pré-compila o CSS do Tailwind (seguindo o [padrão oficial para libs Tailwind v4](https://github.com/tailwindlabs/tailwindcss/discussions/18545)), você precisa adicionar **duas linhas** no CSS principal do seu projeto (ex: `globals.css`):

```css
@import "tailwindcss";

/* Aponta o Tailwind para o dist da lib, gerando as utility classes dos componentes */
@source "../../node_modules/@tree-ia/design-system/dist";
```

> **Por que `@source`?** O Tailwind v4 ignora `node_modules` por padrão. A diretiva `@source` faz ele escanear o JS compilado da lib e gerar apenas as classes usadas pelos componentes, usando o tema do **seu** projeto. Essa é a mesma abordagem usada por libs como [HeroUI](https://www.heroui.com/docs/guide/tailwind-v4).

### 2. Importar o CSS de animações

No layout raiz (ex: `layout.tsx` ou `_app.tsx`):

```tsx
import "@tree-ia/design-system/styles.css";
```

Este arquivo contém apenas keyframes e classes de animação (spinners, toasts, transições). Não inclui Tailwind, portanto não conflita com o seu tema.

### 3. Configurar o dark mode (Tailwind v4)

A lib usa a classe `.dark` no `<html>` para dark mode. Adicione ao seu CSS:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### 4. Envolver com o DashboardProvider

```tsx
import { DashboardProvider } from "@tree-ia/design-system";

const config = {
  name: "MeuProjeto",
  colors: {
    primary: "#ff521d",
    surface: "#FFFFFF",
    background: "#F2F2F2",
    // demais cores usam os defaults se omitidas
  },
};

export default function Layout({ children }) {
  return (
    <DashboardProvider config={config}>
      {children}
    </DashboardProvider>
  );
}
```

Pronto! Todos os componentes agora respondem ao seu tema.

---

## Tema e Cores

O `DashboardProvider` injeta CSS custom properties no `:root`. Todos os componentes referenciam essas variáveis. Você pode passar apenas as cores que quiser sobrescrever — o resto usa os defaults.

### ThemeColors

| Propriedade | CSS Variable | Default | Uso |
|---|---|---|---|
| `primary` | `--dashboard-primary` | `#37A501` | Botões, links ativos, switches, foco |
| `secondary` | `--dashboard-secondary` | `#f0f0f0` | Cor de apoio (disponível para o consumidor) |
| `background` | `--dashboard-background` | `#F2F2F2` | Fundo da página, sidebar |
| `surface` | `--dashboard-surface` | `#FFFFFF` | Fundo de cards, modais, inputs, tabelas |
| `textPrimary` | `--dashboard-text-primary` | `#2d2d2d` | Textos principais, títulos |
| `textSecondary` | `--dashboard-text-secondary` | `#6b7280` | Textos secundários, borders, placeholders |
| `statusSuccess` | `--dashboard-status-success` | `#10B981` | Toasts e badges de sucesso |
| `statusDanger` | `--dashboard-status-danger` | `#EF4444` | Erros, botão danger, validação |
| `statusWarning` | `--dashboard-status-warning` | `#F59E0B` | Toasts e badges de aviso |
| `statusInfo` | `--dashboard-status-info` | `#3B82F6` | Toasts e badges informativos |
| `statusNeutral` | `--dashboard-status-neutral` | `#6B7280` | Badges neutros |

### Exemplo de tema completo

```tsx
const eaiGarcom = {
  name: "EaiGarcom",
  colors: {
    primary: "#ff521d",
    secondary: "#faf2e0",
    background: "#F2F2F2",
    surface: "#FFFFFF",
    textPrimary: "#2d2d2d",
    textSecondary: "#6b7280",
    statusSuccess: "#10B981",
    statusDanger: "#EF4444",
    statusWarning: "#F59E0B",
    statusInfo: "#3B82F6",
    statusNeutral: "#6B7280",
  },
};
```

---

## Componentes

### Button

```tsx
import { Button } from "@tree-ia/design-system";

<Button variant="primary" size="md" onClick={handleClick}>
  Salvar
</Button>

<Button variant="danger" isLoading>
  Excluindo...
</Button>

<Button variant="ghost" icon={<Trash size={16} />} />
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "danger" \| "ghost"` | `"primary"` | Estilo visual |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho |
| `isLoading` | `boolean` | `false` | Mostra spinner e desabilita |
| `icon` | `ReactNode` | - | Ícone. Se sem children, renderiza como botão ícone |
| `iconPosition` | `"left" \| "right"` | `"left"` | Posição do ícone |

Herda todos os atributos nativos de `<button>`.

---

### Input

```tsx
import { Input } from "@tree-ia/design-system";

<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  error="Email inválido"
/>

<Input placeholder="Buscar...">
  <Search className="h-4 w-4" />
</Input>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `label` | `string` | - | Label acima do input |
| `error` | `string` | - | Mensagem de erro abaixo (borda vermelha) |
| `children` | `ReactNode` | - | Elemento posicionado à direita dentro do input |

Herda todos os atributos nativos de `<input>`. Aceita `ref` via `forwardRef`.

---

### Dropdown

```tsx
import { Dropdown } from "@tree-ia/design-system";

const options = [
  { value: "sp", label: "São Paulo" },
  { value: "rj", label: "Rio de Janeiro" },
];

<Dropdown
  label="Estado"
  options={options}
  value={selected}
  onChange={setSelected}
  placeholder="Selecione..."
/>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `options` | `DropdownOption[]` | obrigatório | Opções do dropdown |
| `value` | `string` | - | Valor selecionado |
| `onChange` | `(value: string) => void` | obrigatório | Callback de seleção |
| `label` | `string` | - | Label acima |
| `placeholder` | `string` | `"Selecione uma opção"` | Texto quando vazio |
| `variant` | `"default" \| "underline" \| "simple" \| "compact"` | `"default"` | Estilo visual |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Tamanho |
| `error` | `string` | - | Mensagem de erro |
| `disabled` | `boolean` | `false` | Desabilita |
| `fullWidth` | `boolean` | `false` | Ocupa 100% da largura |
| `icon` | `ReactNode` | - | Ícone à esquerda |
| `isActive` | `boolean` | `false` | Destaca com borda primary |

O menu abre via portal no `document.body` (z-index 9999) e fecha ao clicar fora, scroll ou resize.

---

### Table

```tsx
import { Table } from "@tree-ia/design-system";

const columns = [
  { key: "name", header: "Nome", render: (item) => item.name },
  { key: "email", header: "Email", render: (item) => item.email },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (item) => <BadgeStatus label={item.status} variant="success" />,
  },
];

<Table
  columns={columns}
  data={users}
  keyExtractor={(user) => user.id}
  onRowClick={(user) => router.push(`/users/${user.id}`)}
  isLoading={loading}
  emptyMessage="Nenhum usuário encontrado"
/>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `columns` | `TableColumn<T>[]` | obrigatório | Definição das colunas |
| `data` | `T[]` | obrigatório | Array de dados |
| `keyExtractor` | `(item: T) => string` | obrigatório | Chave única por linha |
| `onRowClick` | `(item: T) => void` | - | Callback ao clicar na linha |
| `isLoading` | `boolean` | `false` | Mostra skeleton de loading |
| `emptyMessage` | `string` | `"Nenhum registro encontrado"` | Mensagem quando vazio |
| `loadingComponent` | `ReactNode` | - | Substitui o skeleton padrão |
| `emptyComponent` | `ReactNode` | - | Substitui o empty state padrão |

Exporta também: `TableHeader`, `TableBody`, `TableSkeleton`, `TableEmpty`.

---

### Modal

```tsx
import { Modal } from "@tree-ia/design-system";

<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Confirmar exclusão"
  showFooter
  saveButtonText="Excluir"
  saveButtonVariant="danger"
  onSave={handleDelete}
>
  <p>Tem certeza que deseja excluir este item?</p>
</Modal>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `isOpen` | `boolean` | obrigatório | Controle de visibilidade |
| `onClose` | `() => void` | obrigatório | Callback de fechamento |
| `title` | `string` | `""` | Título no header |
| `showFooter` | `boolean` | `false` | Mostra footer com botões |
| `saveButtonText` | `string` | `"Salvar"` | Texto do botão principal |
| `cancelButtonText` | `string` | `"Cancelar"` | Texto do botão cancelar |
| `size` | `"small" \| "medium" \| "large" \| "largeXl" \| "extraLarge"` | `"medium"` | Largura máxima |
| `saveButtonVariant` | `"primary" \| "secondary" \| "danger" \| "ghost"` | `"primary"` | Variante do botão salvar |
| `closeOnEscape` | `boolean` | `true` | Fecha com Escape |
| `closeOnOverlayClick` | `boolean` | `true` | Fecha ao clicar fora |

---

### Card

```tsx
import { Card } from "@tree-ia/design-system";

<Card
  title="Vendas do Mês"
  subtitle="Atualizado há 5 minutos"
  icon={<BarChart size={20} />}
  headerActions={<Button variant="ghost" size="sm">Ver mais</Button>}
  showDivider
>
  <p className="text-2xl font-bold">R$ 12.450,00</p>
</Card>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `title` | `string` | - | Título no header |
| `subtitle` | `string` | - | Subtítulo abaixo do título |
| `icon` | `ReactNode` | - | Ícone ao lado do título |
| `headerActions` | `ReactNode` | - | Ações alinhadas à direita no header |
| `showDivider` | `boolean` | `false` | Linha divisória abaixo do header |

---

### Tabs

```tsx
import { Tabs } from "@tree-ia/design-system";

const tabs = [
  { id: "all", label: "Todos", count: 42 },
  { id: "active", label: "Ativos", count: 38 },
  { id: "inactive", label: "Inativos", count: 4, icon: <Archive size={14} /> },
];

<Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `tabs` | `Tab[]` | obrigatório | Array de tabs |
| `activeTab` | `string` | obrigatório | ID da tab ativa |
| `onChange` | `(tabId: string) => void` | obrigatório | Callback de troca |

Cada `Tab`: `{ id, label, count?, icon? }`.

---

### DateRangePicker

```tsx
import { DateRangePicker } from "@tree-ia/design-system";

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  locale="pt"
/>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `value` | `{ start: Date \| null, end: Date \| null }` | obrigatório | Período selecionado |
| `onChange` | `(range: DateRange) => void` | obrigatório | Callback |
| `locale` | `"pt" \| "en"` | `"pt"` | Idioma |

---

### Title

```tsx
import { Title } from "@tree-ia/design-system";

<Title level={1}>Dashboard</Title>
<Title level={3} size="sm" weight="medium" align="center">Subtítulo</Title>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Tag HTML (h1-h6) |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | auto por level | Tamanho visual |
| `weight` | `"normal" \| "medium" \| "semibold" \| "bold" \| "extrabold"` | `"bold"` | Peso da fonte |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Alinhamento |
| `color` | `string` | `textPrimary` | Classe Tailwind ou cor CSS |

---

### ToggleSwitch

```tsx
import { ToggleSwitch } from "@tree-ia/design-system";

<ToggleSwitch
  enabled={notifications}
  onChange={setNotifications}
  label="Notificações"
  size="md"
/>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `enabled` | `boolean` | obrigatório | Estado on/off |
| `onChange` | `(enabled: boolean) => void` | obrigatório | Callback |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho |
| `label` | `string` | - | Label e aria-label |
| `disabled` | `boolean` | `false` | Desabilita |

---

### BadgeStatus

```tsx
import { BadgeStatus } from "@tree-ia/design-system";

<BadgeStatus label="Ativo" variant="success" />
<BadgeStatus label="Pendente" variant="warning" size="sm" />
<BadgeStatus label="Custom" color="#7c3aed" bgColor="#7c3aed20" />
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `label` | `string` | obrigatório | Texto do badge |
| `variant` | `"success" \| "warning" \| "danger" \| "info" \| "neutral"` | `"neutral"` | Variante de cor |
| `color` | `string` | - | Cor do texto (sobrescreve variante) |
| `bgColor` | `string` | - | Cor de fundo (sobrescreve variante) |
| `size` | `"sm" \| "md"` | `"md"` | Tamanho |

---

### Toast

```tsx
import { Toast } from "@tree-ia/design-system";

<Toast
  title="Salvo com sucesso"
  subtitle="As alterações foram aplicadas"
  type="success"
  duration={4000}
  action={{ label: "Ver", href: "/registro" }}
  onClose={() => {}}
/>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `title` | `string` | obrigatório | Título |
| `type` | `"success" \| "error" \| "warning" \| "info"` | `"success"` | Tipo (cor + ícone) |
| `subtitle` | `string` | - | Subtítulo |
| `duration` | `number` | `4000` | Duração em ms (0 = sem auto-close) |
| `showProgress` | `boolean` | `true` | Barra de progresso |
| `action` | `{ label: string; href?: string; onClick?: () => void; target?: string; rel?: string; closeOnClick?: boolean }` | - | Ação opcional |
| `onClose` | `() => void` | obrigatório | Callback de fechamento |

Geralmente não se usa `Toast` diretamente — use `useNotifications()`.

---

### Loading

```tsx
import { Loading } from "@tree-ia/design-system";

<Loading size="lg" text="Carregando..." />
<Loading variant="border" color="#ff521d" />
<Loading fullscreen text="Processando..." />
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho (16/32/48px) |
| `variant` | `"spinner" \| "border"` | `"spinner"` | Estilo do spinner |
| `text` | `string` | - | Texto abaixo do spinner |
| `color` | `string` | `primary` | Cor do spinner e texto |
| `textColor` | `string` | - | Cor independente do texto |
| `fullscreen` | `boolean` | `false` | Overlay fullscreen |

---

### Pagination

```tsx
import { Pagination } from "@tree-ia/design-system";

<Pagination
  currentPage={page}
  totalPages={10}
  totalItems={95}
  itemsPerPage={10}
  onPageChange={setPage}
  onItemsPerPageChange={setPerPage}
/>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `currentPage` | `number` | obrigatório | Página atual (1-indexed) |
| `totalPages` | `number` | obrigatório | Total de páginas |
| `totalItems` | `number` | obrigatório | Total de itens |
| `itemsPerPage` | `number` | obrigatório | Itens por página |
| `onPageChange` | `(page: number) => void` | obrigatório | Callback de navegação |
| `onItemsPerPageChange` | `(n: number) => void` | - | Callback de itens/página (omitir oculta) |
| `compact` | `boolean` | `false` | Modo compacto |

---

### FormField

```tsx
import { FormField } from "@tree-ia/design-system";

<FormField
  label="Nome"
  name="name"
  value={name}
  onChange={setName}
  required
  error={errors.name}
/>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `label` | `string` | obrigatório | Label do campo |
| `name` | `string` | obrigatório | name/id do input |
| `value` | `string` | obrigatório | Valor controlado |
| `onChange` | `(value: string) => void` | obrigatório | Callback (já extrai o valor) |
| `type` | `"text" \| "email" \| "password" \| "number" \| "tel"` | `"text"` | Tipo do input |
| `error` | `string` | - | Erro de validação |
| `required` | `boolean` | `false` | Mostra asterisco vermelho |

---

### Sidebar

```tsx
import { Sidebar } from "@tree-ia/design-system";
import { Home, Users, Settings } from "lucide-react";
import Link from "next/link"; // ou qualquer framework

const menuItems = [
  { id: "home", label: "Início", href: "/", icon: Home },
  { id: "users", label: "Usuários", href: "/users", icon: Users },
  { id: "settings", label: "Config", href: "/settings", icon: Settings },
];

<Sidebar
  menuItems={menuItems}
  logo={<img src="/logo.svg" alt="Logo" />}
  collapsedLogo={<img src="/icon.svg" alt="Logo" />}
  currentPath={pathname}
  linkComponent={Link}
  isCollapsed={collapsed}
  onToggleCollapse={() => setCollapsed(!collapsed)}
  user={{ name: "João", email: "joao@email.com", subtitle: "Admin" }}
  onLogout={handleLogout}
/>
```

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `menuItems` | `SidebarMenuItem[]` | obrigatório | Itens de navegação |
| `logo` | `ReactNode` | obrigatório | Logo expandido |
| `currentPath` | `string` | obrigatório | Path atual para destaque |
| `collapsedLogo` | `ReactNode` | - | Logo modo colapsado |
| `linkComponent` | `ComponentType` | `<a>` | Componente de link (ex: Next.js Link) |
| `isCollapsed` | `boolean` | `false` | Modo colapsado |
| `onToggleCollapse` | `() => void` | - | Callback toggle (omitir oculta botão) |
| `user` | `SidebarUser` | - | Info do usuário no footer |
| `onUserClick` | `() => void` | - | Callback ao clicar no usuário |
| `onLogout` | `() => void` | - | Callback logout (omitir oculta botão) |
| `logoutLabel` | `string` | `"Sair"` | Texto do botão logout |

Desktop: sidebar fixa à esquerda (280px / 109px colapsada). Mobile: header fixo no topo com menu dropdown.

---

### ThemeSwitcher

```tsx
import { ThemeSwitcher } from "@tree-ia/design-system";

<ThemeSwitcher />
```

Botão que alterna entre light e dark mode. Usa `useTheme()` internamente. Deve estar dentro do `DashboardProvider`.

---

## Hooks

### useTheme

```tsx
import { useTheme } from "@tree-ia/design-system";

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Claro</option>
      <option value="dark">Escuro</option>
      <option value="system">Sistema</option>
    </select>
  );
}
```

| Retorno | Tipo | Descrição |
|---|---|---|
| `theme` | `"light" \| "dark" \| "system"` | Preferência do usuário |
| `setTheme` | `(theme: Theme) => void` | Altera e persiste no localStorage |
| `resolvedTheme` | `"light" \| "dark"` | Tema efetivo resolvido |

---

### useNotifications

```tsx
import { useNotifications } from "@tree-ia/design-system";

function MyComponent() {
  const { addNotification } = useNotifications();

  const handleSave = async () => {
    await save();
    addNotification({
      title: "Salvo!",
      subtitle: "Registro atualizado com sucesso",
      type: "success",
      action: {
        label: "Ver detalhes",
        href: "/detalhes",
      },
    });
  };
}
```

| Retorno | Tipo | Descrição |
|---|---|---|
| `notifications` | `Notification[]` | Lista atual |
| `addNotification` | `(n: Omit<Notification, "id">) => void` | Adiciona toast |
| `removeNotification` | `(id: string) => void` | Remove por ID |
| `clearNotifications` | `() => void` | Remove todos |

Campos opcionais aceitos por `addNotification`: `duration`, `showProgress` e `action`. A ação pode usar `href` ou `onClick`, fecha o toast por padrão e aceita `closeOnClick: false` quando necessário.

---

### useLoading

```tsx
import { useLoading } from "@tree-ia/design-system";

function MyComponent() {
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async () => {
    showLoading();
    await submitForm();
    hideLoading();
  };
}
```

Mostra um overlay fullscreen com spinner. Útil para operações que bloqueiam toda a interface.

---

### useConfig

```tsx
import { useConfig } from "@tree-ia/design-system";

function MyComponent() {
  const config = useConfig();
  console.log(config.name);              // "EaiGarcom"
  console.log(config.colors.primary);    // "#ff521d"
}
```

Retorna o `DashboardConfig` completo (com deep merge dos defaults).

---

## CSS Utilities

O `styles.css` contém apenas keyframes e classes de animação — **nenhum CSS do Tailwind**. As utility classes do Tailwind são geradas pelo seu projeto via `@source` (veja [Setup](#setup)).

```tsx
import "@tree-ia/design-system/styles.css";
```

| Classe | Descrição |
|---|---|
| `dashboard-animate-fade-in` | Fade in (0.3s) |
| `dashboard-animate-fade-out` | Fade out (0.3s) |
| `dashboard-animate-slide-down` | Slide de cima (0.2s) |
| `dashboard-animate-slide-up` | Slide para cima (0.2s) |
| `dashboard-animate-slide-left` | Slide da direita (0.3s) |
| `dashboard-animate-slide-right` | Slide para direita (0.3s) |
| `dashboard-animate-expand` | Expandir (max-height 0 -> 1000px) |
| `dashboard-animate-collapse` | Colapsar (max-height 1000px -> 0) |
| `dashboard-animate-shimmer` | Shimmer para skeletons |
| `dashboard-animate-bounce-dot` | Bounce pulsante |

---

## Configuração Avançada

### ComponentsConfig

Além de cores, você pode configurar comportamentos padrão dos componentes:

```tsx
const config = {
  colors: { ... },
  components: {
    modal: {
      closeOnEscape: true,
      closeOnOverlayClick: true,
    },
    toast: {
      duration: 3000,
      position: "top-right", // "top-left" | "bottom-right" | "bottom-left"
    },
    notification: {
      duration: 5000,
    },
    pagination: {
      itemsPerPageOptions: [10, 20, 30, 50],
      defaultItemsPerPage: 10,
    },
  },
};
```

### createConfig

Para criar configs programaticamente com type safety:

```tsx
import { createConfig } from "@tree-ia/design-system";

const config = createConfig({
  name: "MeuApp",
  colors: { primary: "#ff521d" },
  // tudo que não for passado usa os defaults
});
```

---

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar Storybook
npm run storybook

# Build da lib
npm run build

# Type check
npm run typecheck

# Formatar código
npm run format
```

### Storybook

O Storybook inclui um seletor de temas na toolbar (EaíGarçom, EaíPrefeito, MeuConstrutor) para visualizar componentes em diferentes marcas.

### Publicação

A publicação é automática via GitHub Actions. Ao criar uma Release no GitHub:

1. Bump a versão: `npm version patch|minor|major`
2. Push com tag: `git push origin main --tags`
3. Crie a Release no GitHub a partir da tag
4. O workflow publica automaticamente no GitHub Packages
