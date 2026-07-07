// V0 stub — layout snapshot types used by RetroOffice3D
import type { FurnitureItem } from "@/features/retro-office/core/types";

export type OfficeLayoutSnapshot = {
  id: string;
  label: string;
  floors: { [floorId: string]: FurnitureItem[] };
  furniture: FurnitureItem[];
  width: number;
  height: number;
};
