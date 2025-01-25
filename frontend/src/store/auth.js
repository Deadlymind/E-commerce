import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useAuthStore = create((set) => ({
    // Initial state
    allUserData: null, // Explicitly initialize `allUserData` as null
    loading: false, // Explicitly initialize `loading` as false

    // Computed property
    get isLoggedIn() {
        return !!this.allUserData; // Use `this` to access `allUserData`
    },

    // Actions
    setUser: (user) => set({ allUserData: user }),
    setLoading: (loading) => set({ loading }),
}));

// Enable store devtools in development
if (import.meta.env.DEV) {
    mountStoreDevtool('Store', useAuthStore);
}

export { useAuthStore };
