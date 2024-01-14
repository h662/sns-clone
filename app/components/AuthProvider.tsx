"use client";

import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

const Provider: FC<AuthProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
