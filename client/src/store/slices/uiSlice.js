import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('nexusai_theme') !== 'light',
    chatOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('nexusai_theme', state.darkMode ? 'dark' : 'light');
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
      }
    },
    toggleChat: (state) => { state.chatOpen = !state.chatOpen; },
    openChat: (state) => { state.chatOpen = true; },
    closeChat: (state) => { state.chatOpen = false; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false; },
  },
});

export const { toggleDarkMode, toggleChat, openChat, closeChat, toggleSearch, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectChatOpen = (state) => state.ui.chatOpen;
export const selectSearchOpen = (state) => state.ui.searchOpen;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
export default uiSlice.reducer;

