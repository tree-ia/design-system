"use client";

import React, { useState } from "react";
import { LoadingContext } from "../hooks/useLoading";
import { Loading } from "../components/Loading";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && <Loading size="lg" text="Carregando..." fullscreen />}
    </LoadingContext.Provider>
  );
}
