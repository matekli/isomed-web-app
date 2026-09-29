/*
 * Název souboru:    usePersistedState.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro správu perzistentího stavu pomocí localStorage
 */

import { useEffect, useState } from "react";
import { getItem, setItem } from "utils/localStorage";

export const usePersistedState = <T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    const item = getItem(key);

    return (item as T) || initialValue;
  });

  useEffect(() => {
    setItem(key, value);
  }, [value]);

  return [value, setValue] as const;
};
