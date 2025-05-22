import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {User} from "../models/user";

export const useAuthStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);

    function setAuthData(data: { user: User; token: string }) {
        user.value = data.user;
        token.value = data.token;
        localStorage.setItem('token', data.token);
    }

    function clearAuthData() {
        user.value = null;
        token.value = null;
        localStorage.removeItem('token');
    }

    return {user, token, setAuthData, clearAuthData};
});
