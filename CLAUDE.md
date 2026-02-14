# Context & Standards: React + TanStack + shadcn/ui

## Tech Stack
- **Frontend**: React 18+ (Vite).
- **Routing**: TanStack Router (File-based routing).
- **State Management**: TanStack Query (Server state) + React Hooks (Local state).
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS).
- **Validation**: Zod (Shared schemas with API if possible).
- **HTTP Client**: Axios (with Bearer Token interceptor).
- **Internationalisation**: react-i18next (i18next).

## Project Structure
- `src/routes/`: Route definitions (File-based: `__root.tsx`, `index.tsx`, `login.tsx`).
- `src/components/ui/`: shadcn/ui atomic components (Do not modify logic unless necessary).
- `src/features/`: Domain logic (e.g., `features/calories/`, `features/auth/`).
  - `api/`: TanStack Query hooks.
  - `components/`: Feature-specific components.
  - `types.ts`: Zod schemas and TypeScript interfaces.
- `src/i18n/`: Configuration i18next et fichiers de traduction.
  - `i18n.ts`: Initialisation i18next.
  - `fr/translation.json`: Traductions françaises (structure miroir de `src/`).
- `src/lib/`: Shared utilities (axios client, shadcn `cn` helper).

## Coding Rules
- **Type Safety**: Use TanStack Router's `createFileRoute`. Never use `any`.
- **UI**: Always use shadcn/ui components for consistency. Use `cn()` helper for tailwind classes.
- **Forms**: Use `react-hook-form` with `@hookform/resolvers/zod`.
- **Data Fetching**: Use `useQuery` for fetching and `useMutation` for updates/scans.
- **Scanning**: Wrap barcode scanner logic in a Radix `Dialog` to control camera lifecycle.
- **i18n**: Ne jamais écrire de texte visible en dur. Utiliser `useTranslation()` dans les composants et `i18n.t()` dans les hooks/utilitaires. Les clés reflètent le chemin exact du fichier source : `features.<domain>.<dossier>.<NomFichier>.<key>` (ex: `features.products.views.ProductsPage.title`).

## Common Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Add Component: `npx shadcn-ui@latest add [component]`
- Route Gen: Router generates routes automatically via the Vite plugin.

## Naming Conventions
- Components: PascalCase.
- Hooks: `use` prefix (camelCase).
- Files: PascalCase for components.