import { create } from "zustand";

interface ThemeStoreType {
  theme: string;
  toggleTheme: () => void;
}

const savedTheme = localStorage.getItem("theme") || "light";

const useTheme = create<ThemeStoreType>()((set) => ({
  theme: savedTheme,
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));

export default useTheme;
