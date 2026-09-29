/*
 * Název souboru:    useGroupTableData.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro připravení dat pro zobrazení v tabulce
 */

import {
  Group,
  GroupTableData,
  GroupMembership,
} from "features/group/types/types";
import { useMemo } from "react";

interface useGroupTableDataProps {
  groups: Group[];
  memberships: GroupMembership[];
}
const useGroupTableData = ({ groups, memberships }: useGroupTableDataProps) => {
  const prepareData = (
    groups: Group[],
    memberships: GroupMembership[],
  ): GroupTableData[] => {
    if (!Array.isArray(groups)) {
      return [];
    }
    return groups.map((group) => {
      const { id, name } = group;
      const count = memberships.filter((membership) => {
        return membership.group_id === id;
      }).length;

      return {
        id: id.toString(),
        name,
        count: count,
      };
    });
  };

  return useMemo(() => prepareData(groups, memberships), [groups, memberships]);
};

export default useGroupTableData;
