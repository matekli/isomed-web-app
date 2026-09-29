/*
 * Název souboru:    useComparison.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook, který poskytuje funkce pro práci s localStorage,
 *                   umožňuje přidávat, upravovat, odstraňovat a spravovat seznamy
 *                   porovnání vyšetření s využitím persistovaných dat.
 */

import { usePersistedState } from "hooks/usePersistedState";
import { successToast } from "components/ui/toast";
import { Comparison, ComparisonList } from "../types/types";
import { useEffect } from "react";
import { useComparisonStore } from "../store/comparisonStore";

export const useComparison = () => {
  const [comparisons, setComparisons] = usePersistedState<ComparisonList[]>(
    "comparisons",
    [],
  );

  const setLoaded = useComparisonStore((state) => state.setLoaded);

  useEffect(() => {
    const handleChange = (e: StorageEvent) => {
      if (e.key === "comparisons") {
        setComparisons(JSON.parse(e.newValue ?? ""));
      }
    };
    window.addEventListener("storage", handleChange);
  }, []);
  // Vrátí true, pokud test se stejným ID je v poli porovnání.
  const isExisting = (comparisons: Comparison[], newComp: Comparison) => {
    const result = comparisons.find(
      (c) => c.id === newComp.id && c.set === newComp.set,
    );

    return result ? true : false;
  };

  // Vrátí index v seznamu porovnání, kam by měl být nový porovnání přidán, nebo null.
  const checkConflict = (
    comparisons: ComparisonList[],
    newComp: Comparison,
  ) => {
    for (let index = 0; index < comparisons.length; index++) {
      const element = comparisons[index];

      if (
        element.type === newComp.type &&
        element.joint === newComp.joint &&
        element.comparisons.length < 4
      ) {
        if (!isExisting(element.comparisons, newComp)) {
          return element.index;
        }
      }
    }
    return null;
  };

  const addComparison = (newComparison: Comparison) => {
    setComparisons((previousLists) => {
      const targetIndex = checkConflict(previousLists, newComparison);

      // Pokuď existuje vhodný seznam, přidáme do něj nové  porovnání
      if (targetIndex !== null) {
        return previousLists.map((list) => {
          if (list.index === targetIndex) {
            return {
              ...list,
              comparisons: [...list.comparisons, newComparison],
            };
          }
          return list;
        });
      }

      // Jinak vytvoříme nový seznam
      const newComparisonList: ComparisonList = {
        index: previousLists.length,
        type: newComparison.type,
        joint: newComparison.joint,
        comparisons: [newComparison],
      };

      return [...previousLists, newComparisonList];
    });
    setLoaded(false);
    successToast("Examination added to comparison");
  };

  const updateComparison = (
    updatedComparison: Comparison,
    targetListIndex: number,
  ) => {
    setComparisons((prevLists) => {
      return prevLists.map((list) => {
        // Najdeme správný ComparisonList podle indexu
        if (list.index !== targetListIndex) return list;

        // Zkontrolujeme, zda seznam obsahuje Comparison s daným ID
        const exists = list.comparisons.some(
          (l) => l.id === updatedComparison.id,
        );
        if (!exists) return list;

        // Nahradíme daný Comparison novým
        const updatedComparisons = list.comparisons.map((c) =>
          c.id === updatedComparison.id && c.set === updatedComparison.set
            ? updatedComparison
            : c,
        );

        return {
          ...list,
          comparisons: updatedComparisons,
        };
      });
    });
    setLoaded(false);

    successToast("Selected repetitions updated");
  };

  const removeComparison = (
    id: string,
    set: number,
    targetListIndex: number,
  ) => {
    setComparisons((prevLists) => {
      const updatedLists = prevLists
        .map((list) => {
          if (list.index !== targetListIndex) return list;

          const filteredComparisons = list.comparisons.filter(
            (c) => !(c.id === id && c.set === set),
          );

          if (filteredComparisons.length === 0) {
            return null;
          }

          return {
            ...list,
            comparisons: filteredComparisons,
          };
        })
        .filter((list) => list !== null);

      return updatedLists;
    });

    successToast("Examination removed");
  };

  const removeComparisonList = (targetListIndex: number) => {
    setComparisons((prev) => prev.filter((p) => p.index !== targetListIndex));
  };

  const getCount = () => {
    return comparisons.length;
  };

  return {
    addComparison,
    updateComparison,
    removeComparison,
    removeComparisonList,
    getCount,
    comparisons,
  };
};
