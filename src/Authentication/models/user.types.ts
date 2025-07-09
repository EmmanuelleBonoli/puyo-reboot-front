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
  avatar: 'avatar1',
  astronaut: 'astronaut1',
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
