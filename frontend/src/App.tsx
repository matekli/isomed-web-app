/*
 * Název souboru:    App.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hlavní komponenta aplikace, která zajišťuje sdílení nastavení aplikace pomocí kontextu
 *                   a správu dat získaných z API pomocí React Query.
 *                   Také používá knihovnu pro notifikace (React Hot Toast).
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsProvider } from "./features/settings/contexts/SettingsContext";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/AppLayout/AppLayout";

const App = ({ client }: { client: QueryClient }) => {
  return (
    <SettingsProvider>
      <QueryClientProvider client={client}>
        <AppLayout />
        <Toaster />
      </QueryClientProvider>
    </SettingsProvider>
  );
};

export default App;
