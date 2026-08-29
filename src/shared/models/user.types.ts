export type User = {
  isLeftHanded: boolean;
  isMusicEnabled: boolean;
  isSoundEffectsEnabled: boolean;
  language: LangCode;
  astronaut: string;
};

export const initialUser: User = {
  astronaut: '/images/User/Astronaut/astro.png',
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
