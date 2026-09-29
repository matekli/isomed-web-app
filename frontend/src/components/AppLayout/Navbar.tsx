/*
 * Název souboru:    Navbar.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro navigační panel (Navbar), která zobrazuje odkazy pro různé stránky aplikace.
 *                   Obsahuje statickou navigaci pro desktop verzi a hamburger menu pro mobilní verzi.
 *                   Používá komponenty z knihovny Radix UI pro dropdown menu a Lucide React ikonu pro hamburger menu.
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { path: "/comparison", label: "Comparisons" },
  { path: "/group", label: "Groups" },
  { path: "/examination", label: "Examinations" },
  { path: "/patient", label: "Patients" },
  { path: "/saved", label: "Saved" },
  { path: "/settings", label: "Settings" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-full w-full items-center justify-between overflow-hidden">
      <Link to="/" className="mr-auto flex h-full items-center text-base">
        ISOMED
      </Link>

      <nav className="hidden h-full flex-1 list-none items-center justify-end pr-12 lg:flex">
        {navItems.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center p-4 hover:text-secondary ${isActive ? "text-secondary" : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mobilní hamburger menu*/}
      <div className="z-50 lg:hidden">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Menu className={`${isOpen ? "text-secondary" : ""}`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-1 w-96 rounded-lg border border-secondary bg-primary">
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex w-full items-center p-4 hover:text-secondary ${isActive ? "text-secondary" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
