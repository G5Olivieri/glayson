import { AuthService } from "@app/login/auth-service";
import { createContext } from "react";

const AuthContext = createContext<AuthService>(null!);
export default AuthContext;
