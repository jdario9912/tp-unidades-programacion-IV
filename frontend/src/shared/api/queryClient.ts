import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./handle-errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // los errores 4xx no se resuelven reintentando
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status && error.status < 500)
          return false;
        return failureCount < 2;
      },
    },
  },
});
