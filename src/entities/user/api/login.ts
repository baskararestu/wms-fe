import type { LoginPayload } from "../model/types";
import { saveAuthTokens as persistAuthTokens, type AuthTokens } from "../../../shared/auth/tokenStorage";
import { httpClient } from "../../../shared/api/httpClient";

type LoginApiData = AuthTokens;

type LoginApiResponse = {
  code: number;
  message: string;
  data: LoginApiData;
};

export const loginUser = async (payload: Pick<LoginPayload, "email" | "password">) => {
  const response = await httpClient.post<LoginApiResponse>(
    "/api/auth/login",
    {
      email: payload.email,
      password: payload.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Login gagal");
  }

  return response.data.data;
};

export const saveAuthTokens = (tokens: LoginApiData, rememberMe: boolean) => {
  persistAuthTokens(tokens, rememberMe);
};
