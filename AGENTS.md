# AGENTS.md

Academic single-page app **Caja Menuda**: petty-cash control (expense registry with photo evidence, daily report, cash reconciliation). React 19 + Vite + plain JavaScript (`.jsx`, no TypeScript). Data persists in `localStorage`; a public REST API (DummyJSON) is consumed through the service layer to demonstrate GET/POST, loading, error and retry states. Not a git repo yet.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — just `vite build` (no `tsc`; project is JavaScript)
- `npm run lint` — **oxlint**, not ESLint. Don't add eslint config/deps; configure in `.oxlintrc.json`
- `npm run preview` — serve the production build

No test framework or test script exists. Do not invent test commands.

## Architecture

- Entry: `index.html` → `src/main.jsx` (wraps `<GastosProvider>` + `<BrowserRouter>`) → `src/App.jsx` (routes) → `Layout` (Sidebar/Navbar) + pages.
- **All** HTTP calls and `localStorage` access live in `src/services/api.js`. Components never `fetch` directly; pages go through `src/context/GastosContext.jsx` via the `useGastos()` hook (`src/hooks/useGastos.js`).
- `src/context/GastosContext.jsx` owns the global state (gastos, saldo inicial, conciliación) and CRUD. It seeds demo data once (`sembrarDatosIniciales`), persists gastos on every change via a `useEffect`, and demonstrates the React lifecycle (mount/update/unmount cleanup) with comments.
- Public API: DummyJSON — `GET /products` (dashboard "cargar gastos de ejemplo" with AbortController cleanup in `src/pages/Dashboard.jsx`) and `POST /products/add` (fire-and-forget on save). Results of POST are ignored; real persistence is `localStorage`.

## Conventions

- No TypeScript, no enums, no class components. Functional components + hooks only.
- Currency: `src/utils/formatCurrency.js` → `formatCurrency()` outputs `B/. 1,234.50`; use `redondear()` before arithmetic comparisons; `parseMonto()` accepts `,` or `.` decimals.
- Dates are ISO strings (`aaaa-mm-dd`); display via `formarearFecha()` from `src/utils/formatDate.js`.
- Uploaded photos are resized to a JPEG data URL (`src/utils/imageUtils.js`) so they fit in `localStorage` (~5 MB limit).
- Reusable UI states: `Loading`, `Skeleton`, `EmptyState`, `ErrorState`, `Alert`, `Modal`, `ConfirmDialog`, `ImagePreview`.
- CSS is mobile-first in `src/index.css` (single file). Desktop shows the fixed sidebar + table; mobile (<1024px) switches to a hamburger navbar + expense cards. `.skeleton-desktop` / `.skeleton-movil` control per-breakpoint visibility. Print styling lives in the `@media print` block at the end (used by the daily report via `window.print()`).
- All text/UI is in Spanish. Routes: `/` (Dashboard), `/gastos`, `/gastos/nuevo`, `/gastos/editar/:id`, `/conciliacion`, `/reporte`.

## Gotchas

- `localStorage` keys are prefixed `cajaMenuda:`; `cajaMenuda:sembrado` flag prevents re-seeding demo data. To reset the demo data, clear that key (and `cajaMenuda:gastos`) in devtools.
- `npm run lint` is oxlint with the react/typescript/oxc plugins; `react/only-export-components` is a **warning** — files that export a component plus a context object (e.g. `GastosContext.jsx`) may warn; that's expected.
- Don't add routers/state libs beyond `react-router-dom` (already installed, v7).