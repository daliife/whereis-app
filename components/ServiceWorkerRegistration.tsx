"use client";

import { useEffect } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LOG_PREFIX = "[stashly]";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(
            registrations.map(async (registration) => {
              const didUnregister = await registration.unregister();
              if (didUnregister) {
                console.info(
                  `${LOG_PREFIX} Unregistered stale service worker in development.`,
                );
              }
            }),
          ),
        )
        .catch((error) => {
          console.warn(
            `${LOG_PREFIX} Failed to clear service workers in development:`,
            error,
          );
        });
      return;
    }

    const swUrl = `${BASE_PATH}/sw.js`;
    const scope = BASE_PATH ? `${BASE_PATH}/` : "/";

    navigator.serviceWorker.register(swUrl, { scope }).catch((error) => {
      console.warn(`${LOG_PREFIX} Service worker registration failed:`, error);
    });
  }, []);

  return null;
}
