import { Language } from "../constants/Localization";

const TOKEN_KEY = "token";
const LANGUAGE_KEY = "language";

const LocalStorage = {
  getUserToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setUserToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeUserToken: (): void => localStorage.removeItem(TOKEN_KEY),
  getLanguageToken: (): Language =>
    (localStorage.getItem(LANGUAGE_KEY) ?? "en") as Language,
  setLanguageToken: (token: Language): void =>
    localStorage.setItem(LANGUAGE_KEY, token),
  removeLanguageToken: (): void => localStorage.removeItem(LANGUAGE_KEY),
};

export default LocalStorage;
