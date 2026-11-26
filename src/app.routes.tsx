import { createBrowserRouter } from "react-router";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: 'accordion',
    lazy: () => import('./pages/AccordionPage').then(module => ({ Component: module.default })),
  },
  {
    path: 'autocomplete',
    lazy: () => import('./pages/AutocompletePage').then(module => ({ Component: module.default })),
  },
  {
    path: 'autocomplete',
    lazy: () => import('./pages/AutocompletePage').then(module => ({ Component: module.default })),
  },
  {
    path: 'data-table',
    lazy: () => import('./pages/DataTablePage').then(module => ({ Component: module.default })),
  }
]);