import { generateUUID } from '../utils/shared.utils.ts';

export type User = {
  id: string;
  playerName: string;
  isLeftHanded: boolean;
  isMusicEnabled: boolean;
  isSoundEffectsEnabled: boolean;
  language: LangCode;
  avatar: string;
  astronaut: string;
};

export const initialUser: User = {
  id: generateUUID(),
  playerName: 'initial',
  avatar: '/images/User/avatar-2.png',
  astronaut: '/images/Astronaut/astro.png',
  isLeftHanded: false,
  isMusicEnabled: true,
  isSoundEffectsEnabled: true,
  language: 'en',
};

export type LangCode = 'en' | 'fr';

export type LANGUAGE = {
  label: string;
  value: LangCode;
};

export type Image = {
  id: string;
  url: string;
};
