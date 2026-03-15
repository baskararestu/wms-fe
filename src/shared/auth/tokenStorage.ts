export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
};

const ACCESS_TOKEN_KEY = "wms_access_token";
const REFRESH_TOKEN_KEY = "wms_refresh_token";
const STORAGE_MODE_KEY = "wms_token_storage";

const getPreferredStorage = () => {
  const preferredStorage = localStorage.getItem(STORAGE_MODE_KEY);

  if (preferredStorage === "session") {
    return sessionStorage;
  }

  return localStorage;
};

const removeTokenFromAllStorages = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const saveAuthTokens = (tokens: AuthTokens, rememberMe: boolean) => {
  const storage = rememberMe ? localStorage : sessionStorage;

  removeTokenFromAllStorages();
  localStorage.setItem(STORAGE_MODE_KEY, rememberMe ? "local" : "session");

  storage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);

  if (tokens.refresh_token) {
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  }
};

export const setAccessToken = (accessToken: string) => {
  const storage = getPreferredStorage();
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const setRefreshToken = (refreshToken: string) => {
  const storage = getPreferredStorage();
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => {
  const preferredStorage = getPreferredStorage();
  const fallbackStorage = preferredStorage === localStorage ? sessionStorage : localStorage;

  return preferredStorage.getItem(ACCESS_TOKEN_KEY) ?? fallbackStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  const preferredStorage = getPreferredStorage();
  const fallbackStorage = preferredStorage === localStorage ? sessionStorage : localStorage;

  return preferredStorage.getItem(REFRESH_TOKEN_KEY) ?? fallbackStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearAuthTokens = () => {
  removeTokenFromAllStorages();
  localStorage.removeItem(STORAGE_MODE_KEY);
};
