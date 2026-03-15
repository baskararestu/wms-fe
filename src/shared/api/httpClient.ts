import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { clearAuthTokens, getAccessToken, setAccessToken, setRefreshToken } from "../auth/tokenStorage";

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

const refreshAccessToken = async () => {
  const response = await axios.post<RefreshApiResponse>(
    `${API_BASE_URL}${REFRESH_PATH}`,
    {},
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

  httpClient.interceptors.request.use((config) => {
    const token = getAccessToken();

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

      if (!originalRequest || error.response?.status !== 401 || originalRequest._retry || requestUrl.includes(LOGIN_PATH) || requestUrl.includes(REFRESH_PATH)) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const nextAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

        return httpClient(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        return Promise.reject(refreshError);
      }
    },
  );
};
