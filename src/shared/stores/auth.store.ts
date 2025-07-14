import { defineStore } from 'pinia';
import { ref } from 'vue';
import { initialUser, type LangCode, type User } from '../models/user.types.ts';

export const useAuthStore = defineStore('user', () => {
  const user = ref<User>(initialUser);

  function getUser(): User {
    return user.value;
  }

  function setUser(userData: User): void {
    user.value = userData;
  }

  function setGameLanguage(lang: LangCode): void {
    user.value = { ...user.value, language: lang };
  }

  function setAvatar(avatar: string): void {
    user.value = { ...user.value, avatar: avatar };
  }

  function setAstronaut(astronaut: string): void {
    user.value = { ...user.value, astronaut: astronaut };
  }

  function setPlayerName(playerName: string): void {
    user.value = { ...user.value, playerName: playerName };
  }

  return {
    user,
    getUser,
    setUser,
    setGameLanguage,
    setAvatar,
    setAstronaut,
    setPlayerName,
  };
});
