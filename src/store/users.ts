import { create } from "zustand";
import request from "../server";

interface UsersStoreType {
  loading: boolean;
  deleteUser: (id: string) => void;
  blockUser: (id: string) => void;
  unblockUser: (id: string) => void;
  updateRole: (id: string, role: string) => void;
}

const useUsersFunctions = create<UsersStoreType>()((set) => ({
  loading: false,
  deleteUser: async (id) => {
    try {
      set({ loading: true });
      await request.delete(`users/${id}`);
    } finally {
      set({ loading: false });
    }
  },
  blockUser: async (id) => {
    try {
      set({ loading: true });
      await request.patch(`users/${id}/block`);
    } finally {
      set({ loading: false });
    }
  },
  unblockUser: async (id) => {
    try {
      set({ loading: true });
      await request.patch(`users/${id}/unblock`);
    } finally {
      set({ loading: false });
    }
  },
  updateRole: async (id, role) => {
    const newRole = role === "admin" ? "user" : "admin";
    try {
      set({ loading: true });
      await request.patch(`users/${id}/role`, { newRole });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUsersFunctions;
