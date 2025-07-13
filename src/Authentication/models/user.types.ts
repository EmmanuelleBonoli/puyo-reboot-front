import type { Game } from '../../Game/models/game.types.ts';

export type User = {
  email: string;
  playerName: string;
  avatar: string;
  astronaut: string;
  isLeftHanded: boolean;
  isMusicEnabled: boolean;
  isSoundEffectsEnabled: boolean;
  language: LangCode;
};

export const initialUser: User = {
  email: '',
  playerName: 'initial',
  avatar: '/images/User/avatar-2.png',
  astronaut: '/images/Astronaut/astro.png',
  isLeftHanded: false,
  isMusicEnabled: true,
  isSoundEffectsEnabled: true,
  language: 'en',
};

export type AuthLoginResponse = {
  token: string;
  user: User;
  game: Game;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LangCode = 'en' | 'fr';

export type LANGUAGE = {
  label: string;
  value: LangCode;
};
