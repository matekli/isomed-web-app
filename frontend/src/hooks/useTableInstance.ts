/*
 * Název souboru:    useTableInstance.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro správu instance tabulky, umožnuje interagovat s filtry
 *                   nebo měnit počet prvků na jedné stránce
 */

import { useState } from "react";

export const useExaminationTableInstance = () => {
  const [tableInstance, setTableInstance] = useState<any>(null);

  const updateTableInstance = (table: any) => {
    setTableInstance(table);
  };

  return { tableInstance, updateTableInstance };
};
