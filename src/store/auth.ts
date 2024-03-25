import { message } from "antd";
import { create } from "zustand";
import request from "../server/index";
import Cookies from "js-cookie";
import { NavigateFunction } from "react-router-dom";
import { LoginType, RegisterType } from "../types/auth";
import { TOKEN, USER_DATA, USER_ROLE } from "../constants";

interface AuthType {
  isAuthenticated: boolean;
  user: { name: string; role: string; userId: string };
  role: string;
  loading: boolean;
  language: string;
  setLanguage: (language: string) => void;
  login: (values: LoginType, navigate: NavigateFunction) => void;
  register: (values: RegisterType, navigate: NavigateFunction) => void;
  logout: (navigate: NavigateFunction) => void;
}

const useAuth = create<AuthType>()((set) => ({
  isAuthenticated: Boolean(Cookies.get("TOKEN")),
  loading: false,
  user: JSON.parse(localStorage.getItem(USER_DATA) || "{}"),
  language: localStorage.getItem("LANGUAGE") || "en",
  setLanguage: (language) => {
    localStorage.setItem("LANGUAGE", language);
    set(() => ({ language }));
  },
  role: Cookies.get(USER_ROLE) || "",
  login: async (values, navigate) => {
    set({ loading: true });
    try {
      const {
        data: { token, user },
      } = await request.post("auth/login", values);
      set({ isAuthenticated: true, role: user.role, user: user });
      Cookies.set(TOKEN, token);
      Cookies.set(USER_ROLE, user.role);
      localStorage.setItem(USER_DATA, JSON.stringify(user));
      request.defaults.headers.Authorization = `Bearer ${token}`;

      message.success("You are logged in");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } finally {
      set({ loading: false });
    }
  },

  register: async (values, navigate) => {
    set({ loading: true });
    try {
      const {
        data: { token, user },
      } = await request.post("auth/register", values);
      Cookies.set(TOKEN, token);
      localStorage.setItem(USER_DATA, JSON.stringify(user));
      request.defaults.headers.Authorization = `Bearer ${token}`;
      message.success("You are registred!");
      navigate("/login");
    } finally {
      set({ loading: false });
    }
  },

  logout: (navigate) => {
    Cookies.remove(TOKEN);
    Cookies.remove(USER_ROLE);
    localStorage.removeItem(USER_DATA);
    delete request.defaults.headers.Authorization;
    set({ isAuthenticated: false });
    navigate("/login");
  },
}));

export default useAuth;
