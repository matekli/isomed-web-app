/*
 * Název souboru:    AppLayout.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hlavní layout aplikace, který definuje základní strukturu rozhraní.
 *                   Obsahuje hlavičku s navigací, stav synchronizace a hlavní obsah.
 */

import SyncStatus from "./SyncStatus";
import Navbar from "./Navbar";
import MainContent from "./MainContent";

const AppLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-10 items-center border-b border-[#686963] bg-primary px-4 text-base text-white">
        <Navbar />

        <SyncStatus className="hidden lg:flex" />
      </div>

      <MainContent />
      <SyncStatus className="flex h-8 justify-end bg-primary px-2 text-white lg:hidden" />
    </div>
  );
};

export default AppLayout;
