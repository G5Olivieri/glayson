import { useContext } from "react";
import AuthContext from "@app/login/auth-context";

export default function useAuth() {
  return useContext(AuthContext);
}
