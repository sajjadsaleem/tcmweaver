// store/apps/theme.jsx

import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        // Check if window (browser environment) is defined
        return localStorage.getItem('theme') !== 'true';
    }
    // Fallback to dark theme for non-browser environments (server-side rendering, etc.)
    return false;
};

const initialState = {
    isLightMode: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setLightMode: (state) => {
            state.isLightMode = true;
            localStorage.setItem('theme', 'true');
        },
        setDarkMode: (state) => {
            state.isLightMode = false;
            localStorage.setItem('theme', 'false');
        },
    },
});

export const { setLightMode, setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
