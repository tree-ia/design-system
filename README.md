# @tree-ia/dashboard-ui

Biblioteca de componentes React compartilhada para os dashboards da Tree IA (EaiGarcom, EaiPrefeito, MeuConstrutor, etc.). Todos os componentes sao temaveis via CSS custom properties, construidos com Tailwind CSS v4 e publicados no GitHub Packages.

## Instalacao

### 1. Configurar o registry

Crie um `.npmrc` na raiz do projeto consumidor:

```
@tree-ia:registry=https://npm.pkg.github.com
```

### 2. Autenticar (repositorios privados)

```bash
npm login --registry=https://npm.pkg.github.com
# Username: seu-usuario-github
# Password: Personal Access Token com scope read:packages
```

### 3. Instalar

```bash
npm install @tree-ia/dashboard-ui
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

### 1. Importar o CSS

No layout raiz do seu projeto (ex: `layout.tsx` ou `_app.tsx`):

```tsx
import "@tree-ia/dashboard-ui/styles.css";
```

### 2. Configurar o dark mode (Tailwind v4)

A lib usa a classe `.dark` no `<html>` para dark mode. Adicione ao seu CSS:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### 3. Envolver com o DashboardProvider

```tsx
import { DashboardProvider } from "@tree-ia/dashboard-ui";

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

O `DashboardProvider` injeta CSS custom properties no `:root`. Todos os componentes referenciam essas variaveis. Voce pode passar apenas as cores que quiser sobrescrever — o resto usa os defaults.

### ThemeColors

| Propriedade | CSS Variable | Default | Uso |
|---|---|---|---|
| `primary` | `--dashboard-primary` | `#37A501` | Botoes, links ativos, switches, foco |
| `secondary` | `--dashboard-secondary` | `#f0f0f0` | Cor de apoio (disponivel para o consumidor) |
| `background` | `--dashboard-background` | `#F2F2F2` | Fundo da pagina, sidebar |
| `surface` | `--dashboard-surface` | `#FFFFFF` | Fundo de cards, modais, inputs, tabelas |
| `textPrimary` | `--dashboard-text-primary` | `#2d2d2d` | Textos principais, titulos |
| `textSecondary` | `--dashboard-text-secondary` | `#6b7280` | Textos secundarios, borders, placeholders |
| `statusSuccess` | `--dashboard-status-success` | `#10B981` | Toasts e badges de sucesso |
| `statusDanger` | `--dashboard-status-danger` | `#EF4444` | Erros, botao danger, validacao |
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
import { Button } from "@tree-ia/dashboard-ui";

<Button variant="primary" size="md" onClick={handleClick}>
  Salvar
</Button>

<Button variant="danger" isLoading>
  Excluindo...
</Button>

<Button variant="ghost" icon={<Trash size={16} />} />
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "danger" \| "ghost"` | `"primary"` | Estilo visual |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho |
| `isLoading` | `boolean` | `false` | Mostra spinner e desabilita |
| `icon` | `ReactNode` | - | Icone. Se sem children, renderiza como botao icone |
| `iconPosition` | `"left" \| "right"` | `"left"` | Posicao do icone |

Herda todos os atributos nativos de `<button>`.

---

### Input

```tsx
import { Input } from "@tree-ia/dashboard-ui";

<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  error="Email invalido"
/>

<Input placeholder="Buscar...">
  <Search className="h-4 w-4" />
</Input>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `label` | `string` | - | Label acima do input |
| `error` | `string` | - | Mensagem de erro abaixo (borda vermelha) |
| `children` | `ReactNode` | - | Elemento posicionado a direita dentro do input |

Herda todos os atributos nativos de `<input>`. Aceita `ref` via `forwardRef`.

---

### Dropdown

```tsx
import { Dropdown } from "@tree-ia/dashboard-ui";

const options = [
  { value: "sp", label: "Sao Paulo" },
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

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `options` | `DropdownOption[]` | obrigatorio | Opcoes do dropdown |
| `value` | `string` | - | Valor selecionado |
| `onChange` | `(value: string) => void` | obrigatorio | Callback de selecao |
| `label` | `string` | - | Label acima |
| `placeholder` | `string` | `"Selecione uma opcao"` | Texto quando vazio |
| `variant` | `"default" \| "underline" \| "simple" \| "compact"` | `"default"` | Estilo visual |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Tamanho |
| `error` | `string` | - | Mensagem de erro |
| `disabled` | `boolean` | `false` | Desabilita |
| `fullWidth` | `boolean` | `false` | Ocupa 100% da largura |
| `icon` | `ReactNode` | - | Icone a esquerda |
| `isActive` | `boolean` | `false` | Destaca com borda primary |

O menu abre via portal no `document.body` (z-index 9999) e fecha ao clicar fora, scroll ou resize.

---

### Table

```tsx
import { Table } from "@tree-ia/dashboard-ui";

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
  emptyMessage="Nenhum usuario encontrado"
/>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `columns` | `TableColumn<T>[]` | obrigatorio | Definicao das colunas |
| `data` | `T[]` | obrigatorio | Array de dados |
| `keyExtractor` | `(item: T) => string` | obrigatorio | Chave unica por linha |
| `onRowClick` | `(item: T) => void` | - | Callback ao clicar na linha |
| `isLoading` | `boolean` | `false` | Mostra skeleton de loading |
| `emptyMessage` | `string` | `"Nenhum registro encontrado"` | Mensagem quando vazio |
| `loadingComponent` | `ReactNode` | - | Substitui o skeleton padrao |
| `emptyComponent` | `ReactNode` | - | Substitui o empty state padrao |

Exporta tambem: `TableHeader`, `TableBody`, `TableSkeleton`, `TableEmpty`.

---

### Modal

```tsx
import { Modal } from "@tree-ia/dashboard-ui";

<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Confirmar exclusao"
  showFooter
  saveButtonText="Excluir"
  saveButtonVariant="danger"
  onSave={handleDelete}
>
  <p>Tem certeza que deseja excluir este item?</p>
</Modal>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `isOpen` | `boolean` | obrigatorio | Controle de visibilidade |
| `onClose` | `() => void` | obrigatorio | Callback de fechamento |
| `title` | `string` | `""` | Titulo no header |
| `showFooter` | `boolean` | `false` | Mostra footer com botoes |
| `saveButtonText` | `string` | `"Salvar"` | Texto do botao principal |
| `cancelButtonText` | `string` | `"Cancelar"` | Texto do botao cancelar |
| `size` | `"small" \| "medium" \| "large" \| "largeXl" \| "extraLarge"` | `"medium"` | Largura maxima |
| `saveButtonVariant` | `"primary" \| "secondary" \| "danger" \| "ghost"` | `"primary"` | Variante do botao salvar |
| `closeOnEscape` | `boolean` | `true` | Fecha com Escape |
| `closeOnOverlayClick` | `boolean` | `true` | Fecha ao clicar fora |

---

### Card

```tsx
import { Card } from "@tree-ia/dashboard-ui";

<Card
  title="Vendas do Mes"
  subtitle="Atualizado ha 5 minutos"
  icon={<BarChart size={20} />}
  headerActions={<Button variant="ghost" size="sm">Ver mais</Button>}
  showDivider
>
  <p className="text-2xl font-bold">R$ 12.450,00</p>
</Card>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `title` | `string` | - | Titulo no header |
| `subtitle` | `string` | - | Subtitulo abaixo do titulo |
| `icon` | `ReactNode` | - | Icone ao lado do titulo |
| `headerActions` | `ReactNode` | - | Acoes alinhadas a direita no header |
| `showDivider` | `boolean` | `false` | Linha divisoria abaixo do header |

---

### Tabs

```tsx
import { Tabs } from "@tree-ia/dashboard-ui";

const tabs = [
  { id: "all", label: "Todos", count: 42 },
  { id: "active", label: "Ativos", count: 38 },
  { id: "inactive", label: "Inativos", count: 4, icon: <Archive size={14} /> },
];

<Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `tabs` | `Tab[]` | obrigatorio | Array de tabs |
| `activeTab` | `string` | obrigatorio | ID da tab ativa |
| `onChange` | `(tabId: string) => void` | obrigatorio | Callback de troca |

Cada `Tab`: `{ id, label, count?, icon? }`.

---

### DateRangePicker

```tsx
import { DateRangePicker } from "@tree-ia/dashboard-ui";

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  locale="pt"
/>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `value` | `{ start: Date \| null, end: Date \| null }` | obrigatorio | Periodo selecionado |
| `onChange` | `(range: DateRange) => void` | obrigatorio | Callback |
| `locale` | `"pt" \| "en"` | `"pt"` | Idioma |

---

### Title

```tsx
import { Title } from "@tree-ia/dashboard-ui";

<Title level={1}>Dashboard</Title>
<Title level={3} size="sm" weight="medium" align="center">Subtitulo</Title>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Tag HTML (h1-h6) |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | auto por level | Tamanho visual |
| `weight` | `"normal" \| "medium" \| "semibold" \| "bold" \| "extrabold"` | `"bold"` | Peso da fonte |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Alinhamento |
| `color` | `string` | `textPrimary` | Classe Tailwind ou cor CSS |

---

### ToggleSwitch

```tsx
import { ToggleSwitch } from "@tree-ia/dashboard-ui";

<ToggleSwitch
  enabled={notifications}
  onChange={setNotifications}
  label="Notificacoes"
  size="md"
/>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `enabled` | `boolean` | obrigatorio | Estado on/off |
| `onChange` | `(enabled: boolean) => void` | obrigatorio | Callback |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho |
| `label` | `string` | - | Label e aria-label |
| `disabled` | `boolean` | `false` | Desabilita |

---

### BadgeStatus

```tsx
import { BadgeStatus } from "@tree-ia/dashboard-ui";

<BadgeStatus label="Ativo" variant="success" />
<BadgeStatus label="Pendente" variant="warning" size="sm" />
<BadgeStatus label="Custom" color="#7c3aed" bgColor="#7c3aed20" />
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `label` | `string` | obrigatorio | Texto do badge |
| `variant` | `"success" \| "warning" \| "danger" \| "info" \| "neutral"` | `"neutral"` | Variante de cor |
| `color` | `string` | - | Cor do texto (sobrescreve variante) |
| `bgColor` | `string` | - | Cor de fundo (sobrescreve variante) |
| `size` | `"sm" \| "md"` | `"md"` | Tamanho |

---

### Toast

```tsx
import { Toast } from "@tree-ia/dashboard-ui";

<Toast
  title="Salvo com sucesso"
  subtitle="As alteracoes foram aplicadas"
  type="success"
  duration={4000}
  onClose={() => {}}
/>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `title` | `string` | obrigatorio | Titulo |
| `type` | `"success" \| "error" \| "warning" \| "info"` | `"success"` | Tipo (cor + icone) |
| `subtitle` | `string` | - | Subtitulo |
| `duration` | `number` | `4000` | Duracao em ms (0 = sem auto-close) |
| `showProgress` | `boolean` | `true` | Barra de progresso |
| `onClose` | `() => void` | obrigatorio | Callback de fechamento |

Geralmente nao se usa `Toast` diretamente — use `useNotifications()`.

---

### Loading

```tsx
import { Loading } from "@tree-ia/dashboard-ui";

<Loading size="lg" text="Carregando..." />
<Loading variant="border" color="#ff521d" />
<Loading fullscreen text="Processando..." />
```

| Prop | Tipo | Default | Descricao |
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
import { Pagination } from "@tree-ia/dashboard-ui";

<Pagination
  currentPage={page}
  totalPages={10}
  totalItems={95}
  itemsPerPage={10}
  onPageChange={setPage}
  onItemsPerPageChange={setPerPage}
/>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `currentPage` | `number` | obrigatorio | Pagina atual (1-indexed) |
| `totalPages` | `number` | obrigatorio | Total de paginas |
| `totalItems` | `number` | obrigatorio | Total de itens |
| `itemsPerPage` | `number` | obrigatorio | Itens por pagina |
| `onPageChange` | `(page: number) => void` | obrigatorio | Callback de navegacao |
| `onItemsPerPageChange` | `(n: number) => void` | - | Callback de itens/pagina (omitir oculta) |
| `compact` | `boolean` | `false` | Modo compacto |

---

### FormField

```tsx
import { FormField } from "@tree-ia/dashboard-ui";

<FormField
  label="Nome"
  name="name"
  value={name}
  onChange={setName}
  required
  error={errors.name}
/>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `label` | `string` | obrigatorio | Label do campo |
| `name` | `string` | obrigatorio | name/id do input |
| `value` | `string` | obrigatorio | Valor controlado |
| `onChange` | `(value: string) => void` | obrigatorio | Callback (ja extrai o valor) |
| `type` | `"text" \| "email" \| "password" \| "number" \| "tel"` | `"text"` | Tipo do input |
| `error` | `string` | - | Erro de validacao |
| `required` | `boolean` | `false` | Mostra asterisco vermelho |

---

### Sidebar

```tsx
import { Sidebar } from "@tree-ia/dashboard-ui";
import { Home, Users, Settings } from "lucide-react";
import Link from "next/link"; // ou qualquer framework

const menuItems = [
  { id: "home", label: "Inicio", href: "/", icon: Home },
  { id: "users", label: "Usuarios", href: "/users", icon: Users },
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
  user={{ name: "Joao", email: "joao@email.com", subtitle: "Admin" }}
  onLogout={handleLogout}
/>
```

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `menuItems` | `SidebarMenuItem[]` | obrigatorio | Itens de navegacao |
| `logo` | `ReactNode` | obrigatorio | Logo expandido |
| `currentPath` | `string` | obrigatorio | Path atual para destaque |
| `collapsedLogo` | `ReactNode` | - | Logo modo colapsado |
| `linkComponent` | `ComponentType` | `<a>` | Componente de link (ex: Next.js Link) |
| `isCollapsed` | `boolean` | `false` | Modo colapsado |
| `onToggleCollapse` | `() => void` | - | Callback toggle (omitir oculta botao) |
| `user` | `SidebarUser` | - | Info do usuario no footer |
| `onUserClick` | `() => void` | - | Callback ao clicar no usuario |
| `onLogout` | `() => void` | - | Callback logout (omitir oculta botao) |
| `logoutLabel` | `string` | `"Sair"` | Texto do botao logout |

Desktop: sidebar fixa a esquerda (280px / 109px colapsada). Mobile: header fixo no topo com menu dropdown.

---

### ThemeSwitcher

```tsx
import { ThemeSwitcher } from "@tree-ia/dashboard-ui";

<ThemeSwitcher />
```

Botao que alterna entre light e dark mode. Usa `useTheme()` internamente. Deve estar dentro do `DashboardProvider`.

---

## Hooks

### useTheme

```tsx
import { useTheme } from "@tree-ia/dashboard-ui";

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

| Retorno | Tipo | Descricao |
|---|---|---|
| `theme` | `"light" \| "dark" \| "system"` | Preferencia do usuario |
| `setTheme` | `(theme: Theme) => void` | Altera e persiste no localStorage |
| `resolvedTheme` | `"light" \| "dark"` | Tema efetivo resolvido |

---

### useNotifications

```tsx
import { useNotifications } from "@tree-ia/dashboard-ui";

function MyComponent() {
  const { addNotification } = useNotifications();

  const handleSave = async () => {
    await save();
    addNotification({
      title: "Salvo!",
      subtitle: "Registro atualizado com sucesso",
      type: "success",
    });
  };
}
```

| Retorno | Tipo | Descricao |
|---|---|---|
| `notifications` | `Notification[]` | Lista atual |
| `addNotification` | `(n: Omit<Notification, "id">) => void` | Adiciona toast |
| `removeNotification` | `(id: string) => void` | Remove por ID |
| `clearNotifications` | `() => void` | Remove todos |

---

### useLoading

```tsx
import { useLoading } from "@tree-ia/dashboard-ui";

function MyComponent() {
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async () => {
    showLoading();
    await submitForm();
    hideLoading();
  };
}
```

Mostra um overlay fullscreen com spinner. Util para operacoes que bloqueiam toda a interface.

---

### useConfig

```tsx
import { useConfig } from "@tree-ia/dashboard-ui";

function MyComponent() {
  const config = useConfig();
  console.log(config.name);              // "EaiGarcom"
  console.log(config.colors.primary);    // "#ff521d"
}
```

Retorna o `DashboardConfig` completo (com deep merge dos defaults).

---

## CSS Utilities

A lib exporta `styles.css` com classes de animacao utilitarias:

```tsx
import "@tree-ia/dashboard-ui/styles.css";
```

| Classe | Descricao |
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

## Configuracao Avancada

### ComponentsConfig

Alem de cores, voce pode configurar comportamentos padrao dos componentes:

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
import { createConfig } from "@tree-ia/dashboard-ui";

const config = createConfig({
  name: "MeuApp",
  colors: { primary: "#ff521d" },
  // tudo que nao for passado usa os defaults
});
```

---

## Desenvolvimento

```bash
# Instalar dependencias
npm install

# Rodar Storybook
npm run storybook

# Build da lib
npm run build

# Type check
npm run typecheck

# Formatar codigo
npm run format
```

### Storybook

O Storybook inclui um seletor de temas na toolbar (EaiGarcom, EaiPrefeito, MeuConstrutor) para visualizar componentes em diferentes marcas.

### Publicacao

A publicacao e automatica via GitHub Actions. Ao criar uma Release no GitHub:

1. Bump a versao: `npm version patch|minor|major`
2. Push com tag: `git push origin main --tags`
3. Crie a Release no GitHub a partir da tag
4. O workflow publica automaticamente no GitHub Packages
