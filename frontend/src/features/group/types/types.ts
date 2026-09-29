/*
 * Název souboru:    types.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Typy používané v kontextu skupin
 */

export type Group = {
  id: string;
  name: string;
};

export type GroupMembership = {
  item_id: string;
  group_id: string;
};

export type CreateGroup = {
  name: string;
};

export type UpdateGroup = {
  id: string;
  name: string;
};

export type CreateGroupMembership = {
  item_id: string;
  group_id: string;
};

// Typ pro data ktere se zobrazuji v data-table
export type GroupTableData = {
  id: string;
  name: string;
  count: number;
};
