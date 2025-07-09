import { InventoryItemEnum } from './InventoryItemEnum.ts';

export type ItemStore = {
  title: string;
  iconImage: string;
  price: number;
  value: number;
};

export type InventoryItem = ItemStore & {
  inventory: InventoryItemEnum;
};
