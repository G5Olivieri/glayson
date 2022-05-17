import AuthContext from "@app/login/auth-context";
import { AuthService } from "@app/login/auth-service";
import useProvideAuthService from "@app/login/use-provide-auth-service";
import React from "react";

type AuthProviderProps = {
  authService?: AuthService;
  children: JSX.Element;
};

export default function AuthProvider({
  authService,
  children,
}: AuthProviderProps): JSX.Element {
  const service = authService ?? useProvideAuthService();
  return (
    <AuthContext.Provider value={service}>{children}</AuthContext.Provider>
  );
}

AuthProvider.defaultProps = {
  authService: null,
};
