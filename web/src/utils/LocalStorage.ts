const TOKEN_KEY = "token";

const LocalStorage = {
  getUserToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setUserToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeUserToken: (): void => localStorage.removeItem(TOKEN_KEY),
};

export default LocalStorage;
