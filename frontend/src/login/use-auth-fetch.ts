import useAuth from "@app/login/use-auth";
import { useEffect, useRef } from "react";

export default function useAuthFetch() {
  const auth = useAuth();
  const controller = useRef<AbortController>();

  const initWithToken = (
    accessToken: string,
    init?: RequestInit
  ): RequestInit => {
    if (init === undefined) {
      return {
        headers: { authorization: `Bearer ${accessToken}` },
      } as RequestInit;
    }
    const headers = Object.assign(init.headers ?? {}, {
      authorization: `Bearer ${accessToken}`,
    });

    return { ...init, headers };
  };

  useEffect(() => () => controller.current?.abort(), []);

  return async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    controller.current = new AbortController();
    const response = await fetch(
      input,
      initWithToken(
        auth.accessToken,
        Object.assign(init ?? {}, { signal: controller.current.signal })
      )
    );
    controller.current = undefined;
    if (response.status === 401) {
      controller.current = new AbortController();
      const newAccessToken = await auth.tryRefreshToken();
      if (newAccessToken !== null) {
        const resRetry = await fetch(
          input,
          initWithToken(
            newAccessToken,
            Object.assign(init ?? {}, { signal: controller.current.signal })
          )
        );
        controller.current = undefined;
        return resRetry;
      }
    }
    return response;
  };
}
