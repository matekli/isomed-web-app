/*
 * Název souboru:    localStorage.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Pomocné funkce pro práci s localStorage
 */

export const setItem = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`localStorage setItem failed for key "${key}":`, error);
  }
};

export const getItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    console.error(`localStorage getItem failed for key "${key}":`, error);
  }
};
