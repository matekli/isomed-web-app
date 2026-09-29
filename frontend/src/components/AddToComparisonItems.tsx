/*
 * Název souboru:    AddToComparisonItems.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro přidání vyšetření do porovnání.
 *                   Poskytuje výběr setu z vyšetření, který má být přidán do porovnání
 */

import { DropdownMenuItem } from "components/ui/dropdown-menu";
import { Comparison } from "features/comparison/types/types";
import {
  ExaminationTableData,
  testModes,
} from "features/examination/types/types";

type AddToComparisonItemsProps = {
  examination: ExaminationTableData;
  handleAddComparison: (e: React.MouseEvent, comparison: Comparison) => void;
};

const AddToComparisonItems: React.FC<AddToComparisonItemsProps> = ({
  examination,
  handleAddComparison,
}) => {
  const getTestType = (test_mode: string) => {
    switch (test_mode) {
      case testModes.ISOMETRIC:
        return "isometric";
      case testModes.ATHLETIC:
        return "athletic";
      default:
        return "isokinetic";
    }
  };

  const comparison: Comparison = {
    id: examination.id,
    set: 1,
    repetitionsToDelete: [],
    joint: examination.joint,
    type: getTestType(examination.test_mode),
  };

  if (examination.test_mode === testModes.ISOMETRIC) {
    return (
      <DropdownMenuItem
        key={examination.id}
        onMouseDown={(e) => handleAddComparison(e, comparison)}
      >
        Add to comparison
      </DropdownMenuItem>
    );
  }

  return (
    <>
      {Array.from({ length: examination.number_of_sets }, (_, index) => (
        <DropdownMenuItem
          key={index}
          onMouseDown={(e) =>
            handleAddComparison(e, {
              ...comparison,
              set: index + 1,
            })
          }
        >
          Add to comparison - Set {index + 1}
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default AddToComparisonItems;
