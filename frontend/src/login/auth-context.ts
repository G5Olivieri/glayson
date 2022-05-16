import { AuthService } from "@app/login/auth-service";
import { createContext } from "react";

export const AuthContext = createContext<AuthService>(null!)
