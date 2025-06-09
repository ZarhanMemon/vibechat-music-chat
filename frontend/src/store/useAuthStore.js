import { use } from "react";
import { axiosInstance } from "../lib/axios.js";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/check");
      set({ isAdmin: !!data.admin }); // force boolean
    } catch (error) {
      // Defensive error handling: check if error.response exists
      const message =
        error?.response?.data?.message || error.message || "Something went wrong";
      set({ isAdmin: false, error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  },
}));


export default useAuthStore;
