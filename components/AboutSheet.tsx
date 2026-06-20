"use client";

import { useCallback, useRef } from "react";
import AppIcon from "@/components/AppIcon";
import { useDialogA11y } from "@/lib/useDialogA11y";
import { useI18n } from "@/lib/i18n";

interface Props {
  onClose: () => void;
}

function StepIcon({ type }: { type: "search" | "locate" | "qr" }) {
  if (type === "search") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
    );
  }

  if (type === "locate") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-6v-2h4zM14 18h2v2h-2z"
      />
    </svg>
  );
}

export default function AboutSheet({ onClose }: Props) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleClose = useCallback(() => onClose(), [onClose]);

  useDialogA11y(true, containerRef, handleClose, {
    initialFocusRef: closeRef,
  });

  const steps = [
    {
      icon: "search" as const,
      title: t.about.step1Title,
      description: t.about.step1Desc,
    },
    {
      icon: "locate" as const,
      title: t.about.step2Title,
      description: t.about.step2Desc,
    },
    {
      icon: "qr" as const,
      title: t.about.step3Title,
      description: t.about.step3Desc,
    },
  ];

  return (
    <div ref={containerRef} className="sheet-overlay">
      <button
        type="button"
        className="sheet-backdrop"
        onClick={handleClose}
        aria-label={t.common.close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-sheet-title"
        aria-describedby="about-sheet-intro"
        className="sheet-panel sheet-panel--medium"
      >
        <div className="sheet-handle">
          <div className="sheet-handle-bar" aria-hidden="true" />
        </div>

        <div className="flex items-start gap-3 border-b border-zinc-100 px-4 pb-4 pt-3 dark:border-zinc-800 sm:pt-4">
          <AppIcon size={40} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <h2
              id="about-sheet-title"
              className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
            >
              {t.about.title}
            </h2>
            <p
              id="about-sheet-intro"
              className="mt-1 text-sm leading-snug text-zinc-600 dark:text-zinc-400"
            >
              {t.about.intro}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            className="btn-sheet-close shrink-0"
            aria-label={t.common.close}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <ol className="space-y-0">
            {steps.map((step, index) => (
              <li key={step.icon} className="relative flex gap-4 pb-8 last:pb-0">
                {index < steps.length - 1 && (
                  <span
                    className="absolute left-5 top-10 h-[calc(100%-1.25rem)] w-px bg-zinc-200 dark:bg-zinc-700"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 ring-4 ring-white dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-900">
                  <StepIcon type={step.icon} />
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    <span className="sr-only">
                      {t.about.stepLabel(index + 1)}:{" "}
                    </span>
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="sheet-footer">
          <button
            type="button"
            onClick={handleClose}
            className="btn-primary"
          >
            {t.about.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
}
