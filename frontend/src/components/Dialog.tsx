/*
 * Název souboru:    Dialog.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro dialogové okno s ovládacími prvky.
 *                   Umožňuje zobrazení obsahu s možností zavření při
 *                   stisknutí klávesy Escape nebo kliknutí mimo obsah.
 */

import { forwardRef, ReactNode, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import DialogCloseButton from "components/ui/dialogCloseButton";

type DialogProps = {
  children: ReactNode;
  toggleDialog: () => void;
  className?: string;
};
const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ children, toggleDialog, className }, ref) => {
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          toggleDialog();
        }
      };

      window.addEventListener("keydown", handleEscape);

      return () => {
        window.removeEventListener("keydown", handleEscape);
      };
    }, [toggleDialog]);

    // Zavření dialogu pokud uživatel klikne mimo obsah dialogu
    const handleDialogClick = (e: React.MouseEvent) => {
      if (e.currentTarget === e.target) {
        toggleDialog();
      }
    };

    return (
      <dialog
        className={twMerge(
          "rounded-lg border-2 border-slate-600 bg-slate-200 backdrop:bg-gray-500 backdrop:bg-opacity-50",
          className,
        )}
        ref={ref}
        onClick={handleDialogClick}
      >
        <>
          <DialogCloseButton onClick={toggleDialog} />
          {children}
        </>
      </dialog>
    );
  },
);

export default Dialog;
