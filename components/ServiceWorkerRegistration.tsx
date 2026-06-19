"use client";

import { useEffect } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const swUrl = `${BASE_PATH}/sw.js`;
    const scope = BASE_PATH ? `${BASE_PATH}/` : "/";

    navigator.serviceWorker.register(swUrl, { scope }).catch(() => {});
  }, []);

  return null;
}
