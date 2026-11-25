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
  }
]);