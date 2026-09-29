/*
 * Název souboru:    toast.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení toast notifikací.
 *                   Obsahuje funkce pro různé typy toastů: success, error, info a loading.
 *                   Toasty mohou obsahovat ikony a upravené pozice pro zobrazení.
 */

import { LucideCheck, LucideInfo, LucideLoader, LucideX } from "lucide-react";
import { toast } from "react-hot-toast";

export const successToast = (text: string) =>
  toast(text, {
    duration: 2500,
    position: "bottom-right",
    icon: <LucideCheck className="text-secondary" />,
  });

export const errorToast = (text: string) =>
  toast(text, {
    duration: 2500,
    position: "top-center",
    icon: <LucideX color="red" />,
  });

export const infoToast = (text: string, options?: { id?: string }) => {
  toast(text, { icon: <LucideInfo color="blue" />, ...options });
};

export const loadingToast = (
  text: string,
  options?: { id?: string },
  promise?: () => any,
) => {
  toast(text, { icon: <LucideLoader color="grey" />, ...options });
  if (promise) {
    promise().then(() => {
      toast.dismiss(); // Zavření tohoto toastu po dokončení promise
    });
  }
};
