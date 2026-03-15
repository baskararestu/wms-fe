import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { clearAuthTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "../auth/tokenStorage";

type RefreshApiResponse = {
  code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token?: string;
  };
};

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOGIN_PATH = "/api/auth/login";
const REFRESH_PATH = "/api/auth/refresh";

if (!API_BASE_URL) {
  throw new Error("URL is not defined in the environment variables");
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isInterceptorInitialized = false;
let refreshPromise: Promise<string> | null = null;

const TOKEN_REFRESH_BUFFER_IN_SECONDS = 30;

const shouldSkipRefresh = (requestUrl: string) => {
  return requestUrl.includes(LOGIN_PATH) || requestUrl.includes(REFRESH_PATH);
};

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

const isAccessTokenExpired = (token: string) => {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  return payload.exp <= currentTimeInSeconds + TOKEN_REFRESH_BUFFER_IN_SECONDS;
};

const getOrRefreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  const response = await axios.post<RefreshApiResponse>(
    `${API_BASE_URL}${REFRESH_PATH}`,
    refreshToken
      ? {
          refresh_token: refreshToken,
        }
      : {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (response.data.code !== 200 || !response.data.data?.access_token) {
    throw new Error(response.data.message || "Refresh token gagal");
  }

  setAccessToken(response.data.data.access_token);

  if (response.data.data.refresh_token) {
    setRefreshToken(response.data.data.refresh_token);
  }

  return response.data.data.access_token;
};

export const setupAuthInterceptors = () => {
  if (isInterceptorInitialized) {
    return;
  }

  isInterceptorInitialized = true;

  httpClient.interceptors.request.use(async (config) => {
    const token = getAccessToken();
    const requestUrl = config.url ?? "";

    if (token && !shouldSkipRefresh(requestUrl) && isAccessTokenExpired(token)) {
      try {
        const nextAccessToken = await getOrRefreshAccessToken();
        config.headers.Authorization = `Bearer ${nextAccessToken}`;
        return config;
      } catch (refreshError) {
        clearAuthTokens();
        return Promise.reject(refreshError);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryRequestConfig | undefined;
      const requestUrl = originalRequest?.url ?? "";

      if (!originalRequest || error.response?.status !== 401 || originalRequest._retry || shouldSkipRefresh(requestUrl)) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const nextAccessToken = await getOrRefreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

        return httpClient(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        return Promise.reject(refreshError);
      }
    },
  );
};
