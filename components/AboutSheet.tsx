"use client";

import { useCallback, useRef } from "react";
import AppIcon from "@/components/AppIcon";
import UiIcon from "@/components/icons/UiIcon";
import { useDialogA11y } from "@/lib/useDialogA11y";
import { useI18n } from "@/lib/i18n";

interface Props {
  onClose: () => void;
}

function StepIcon({ type }: { type: "search" | "locate" | "qr" }) {
  return <UiIcon name={type} className="h-5 w-5" />;
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
            <UiIcon name="close" className="h-5 w-5" />
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
