import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

import { API_BASE_URL, API_PATH } from '../services/api-path';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  isOwner: boolean;
  firstLogin: boolean;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isLoading = ref(false);

    // --Getters--
    const isLoggedIn = computed(() => user.value !== null);
    const isAdmin = computed(() => user.value?.isAdmin || false);
    const isOwner = computed(() => user.value?.isOwner || false);

    // --Actions--
    async function login(username: string, password: string) {
        isLoading.value = true;
        try {
            const response = await api.post(`/${API_PATH.users}/login`, { username, password });
            user.value = response.data.data;
            return true;
        } catch (error) {
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        try {
            await api.post(`/${API_PATH.users}/logout`);
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            user.value = null;
        }
    }

    async function checkAuthStatus() {
        try {
            const response = await api.get(`/${API_PATH.users}/current`);
            user.value = response.data.data;
        } catch (error) {
            user.value = null;
        }
    }

    return {
        user,
        isLoading,
        isLoggedIn,
        isAdmin,
        isOwner,
        login,
        logout,
        checkAuthStatus,
    };
});