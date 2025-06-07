export type User = {
  email: string;
  playName: string;
  avatar: string;
  isLeftHanded: boolean;
};

export type AuthLoginResponse = {
  token: string;
  user: User;
  gameId: string;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};
