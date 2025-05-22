export type User = {
    email: string;
}

export type AuthLoginResponse = {
    token: string;
    user: User;
}

export type AuthLoginRequest = {
    email: string;
    password: string;
}

export type LoginFormValues = {
    email: string;
    password: string;
}