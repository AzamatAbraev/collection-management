import { message } from "antd";
import { create } from "zustand";
import request from "../server/index";
import Cookies from "js-cookie";
import { NavigateFunction } from "react-router-dom";
import { LoginType, RegisterType } from "../types/auth";
import { TOKEN, USER_DATA } from "../constants";

interface AuthType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (values: LoginType, navigate: NavigateFunction) => void;
  register: (values: RegisterType, navigate: NavigateFunction) => void;
  logout: (navigate: NavigateFunction) => void;
}

const useAuth = create<AuthType>()((set) => ({
  isAuthenticated: Boolean(Cookies.get("TOKEN")),
  loading: false,

  login: async (values, navigate) => {
    set({ loading: true });
    try {
      const {
        data: { token, user },
      } = await request.post("auth/login", values);
      set({ isAuthenticated: true });
      Cookies.set("TOKEN", token);
      localStorage.setItem(USER_DATA, JSON.stringify(user));
      request.defaults.headers.Authorization = `Bearer ${token}`;

      message.success("You are logged in");
      navigate("/");
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
    Cookies.remove("TOKEN");
    localStorage.removeItem(USER_DATA);
    delete request.defaults.headers.Authorization;
    set({ isAuthenticated: false });
    navigate("/login");
  },
}));

export default useAuth;
