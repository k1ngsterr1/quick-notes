"use client";
import { create } from "zustand";

interface NavigationStore {
  activePage: string;
  changePage: (name: string) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activePage: "MainScreen",
  changePage: (name) => set({ activePage: name }),
}));
