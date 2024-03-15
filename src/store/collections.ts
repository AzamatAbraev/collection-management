import { create } from "zustand";
import request from "../server";
import CollectionType from "../types/collection";
import { message } from "antd";

interface ValuesType {
  name: string;
  description: string;
  category: string;
}

interface CollectionStoreType {
  loading: boolean;
  collections: CollectionType[];
  getAllCollections: () => void;
  addCollection: (values: {
    name: string;
    description: string;
    category: string;
  }) => void;
  updateCollection: (values: ValuesType, id: string) => void;
  deleteCollection: (id: string) => void;
}

const useCollection = create<CollectionStoreType>()((set, get) => ({
  loading: false,
  collections: [],
  getAllCollections: async () => {
    try {
      set({ loading: true });
      const { data } = await request.get("collections");
      set({ collections: data });
    } finally {
      set({ loading: false });
    }
  },
  addCollection: async (values) => {
    try {
      set({ loading: true });
      await request.post("collections", { values });
      get().getAllCollections();
      message.success("Collection added successfully");
    } finally {
      set({ loading: false });
    }
  },
  updateCollection: async (values, id) => {
    try {
      set({ loading: true });
      await request.patch(`collections/${id}`, { values });
      get().getAllCollections();
      message.success("Collection updated successfully");
    } finally {
      set({ loading: false });
    }
  },
  deleteCollection: async (id) => {
    try {
      set({ loading: true });
      await request.delete(`collections/${id}`);
      get().getAllCollections();
      message.info("Collection deleted");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCollection;
