import { create } from "zustand";
import ItemType from "../types/item";
import request from "../server";

interface ItemsStoreType {
  loading: boolean;
  items: ItemType[];
  latestItems: ItemType[];
  getAllItems: () => void;
  getLatestItems: () => void;
}

const useItems = create<ItemsStoreType>()((set) => ({
  loading: false,
  items: [],
  latestItems: [],
  getAllItems: async () => {
    try {
      set({ loading: true });
      const { data } = await request.get("items");
      set({ items: data });
    } finally {
      set({ loading: false });
    }
  },
  getLatestItems: async () => {
    try {
      set({ loading: true });
      const { data } = await request.get("items/latest");
      set({ latestItems: data });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useItems;
