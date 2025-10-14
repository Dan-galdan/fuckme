import { create } from 'zustand';

interface UIState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (darkMode: boolean) => void;
}

export const useUIStore = create<UIState>((set: any) => ({
  darkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () => set((state: any) => {
    const newDarkMode = !state.darkMode;
    localStorage.setItem('darkMode', newDarkMode.toString());
    return { darkMode: newDarkMode };
  }),
  setDarkMode: (darkMode: any) => {
    localStorage.setItem('darkMode', darkMode.toString());
    set({ darkMode });
  },
}));
