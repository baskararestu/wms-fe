import { httpClient } from "../../../shared/api/httpClient";
import { clearAuthTokens, getRefreshToken } from "../../../shared/auth/tokenStorage";

type LogoutApiResponse = {
  code: number;
  message: string;
};

export const logoutUser = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthTokens();
    return;
  }

  try {
    const response = await httpClient.post<LogoutApiResponse>(
      "/api/auth/logout",
      {
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.code !== 200) {
      throw new Error(response.data.message || "Logout gagal");
    }
  } finally {
    clearAuthTokens();
  }
};
