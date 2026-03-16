import { clearAuthTokens, getAccessToken } from "./tokenStorage";

export const AUTH_LOGOUT_EVENT = "wms:auth-logout";
const TOKEN_REFRESH_BUFFER_IN_SECONDS = 30;

const parseJwtPayload = (token: string) => {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const decodedPayload = window.atob(paddedPayload);

    return JSON.parse(decodedPayload) as { exp?: number };
  } catch {
    return null;
  }
};

export const isAccessTokenExpired = (token: string, bufferSeconds = TOKEN_REFRESH_BUFFER_IN_SECONDS) => {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  return payload.exp <= currentTimeInSeconds + bufferSeconds;
};

export const hasValidAccessToken = () => {
  const token = getAccessToken();

  if (!token) {
    return false;
  }

  return !isAccessTokenExpired(token, 0);
};

export const forceLogout = () => {
  clearAuthTokens();
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};
