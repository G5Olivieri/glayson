import { Credential } from "@app/login/credential";

export interface AuthService {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string;
  signin(credential: Credential): Promise<void>;
  signout(): Promise<void>;
}
