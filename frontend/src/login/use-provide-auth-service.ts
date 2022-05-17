import { AuthService } from "@app/login/auth-service";
import { Credential } from "@app/login/credential";
import { useEffect, useState } from "react";

type AccessTokenType = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export default function useProvideAuthService(): AuthService {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const clearToken = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expired_at");
    setAccessToken("");
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const setToken = (
    newAccessToken: string,
    refreshToken: string,
    expiresIn: number
  ) => {
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem(
      "expired_at",
      (new Date().getTime() + expiresIn * 1000).toString()
    );
    setAccessToken(newAccessToken);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const signin = async (credential: Credential) => {
    const response = await fetch(`${baseUrl}/api/auth/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "password",
        ...credential,
      }),
    });
    const body = (await response.json()) as AccessTokenType;
    setToken(body.access_token, body.refresh_token, body.expires_in);
  };

  const signout = async () => {
    const storagedAccessToken = localStorage.getItem("access_token");
    if (storagedAccessToken) {
      await fetch(`${baseUrl}/api/auth/token/invalidate`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ access_token: storagedAccessToken }),
      });
      clearToken();
    }
  };

  const isExpired = (expiredAt: string): boolean => {
    const expiredAtInt = parseInt(expiredAt, 10);
    const now = new Date().getTime();
    return now > expiredAtInt;
  };

  const refreshToken = async (
    oldAccessToken: string,
    oldRefreshToken: string
  ) =>
    fetch(`${baseUrl}/api/auth/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        access_token: oldAccessToken,
        refresh_token: oldRefreshToken,
      }),
    }).then((res) => res.json() as Promise<AccessTokenType>);

  useEffect(() => {
    const storagedAccessToken = localStorage.getItem("access_token");
    const storagedRefreshToken = localStorage.getItem("refresh_token");
    const storagedExpiredAt = localStorage.getItem("expired_at");

    if (!storagedAccessToken || !storagedRefreshToken || !storagedExpiredAt) {
      clearToken();
      return;
    }

    if (isExpired(storagedExpiredAt)) {
      refreshToken(storagedAccessToken, storagedRefreshToken)
        .then((response) => {
          setToken(
            response.access_token,
            response.refresh_token,
            response.expires_in
          );
        })
        .catch(() => clearToken());
      return;
    }

    fetch(`${baseUrl}/api/auth/token/check`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ access_token: storagedAccessToken }),
    }).then((response) => {
      if (response.ok) {
        setAccessToken(storagedAccessToken);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      clearToken();
    });
  }, []);

  return {
    isLoading,
    isAuthenticated,
    accessToken,
    signin,
    signout,
  };
}
