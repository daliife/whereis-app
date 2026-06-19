import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

interface DialogA11yOptions {
  returnFocusRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  lockScroll?: boolean;
}

export function useDialogA11y(
  isOpen: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  options: DialogA11yOptions = {},
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { returnFocusRef, initialFocusRef, lockScroll = true } = options;

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    function focusInitial() {
      const container = containerRef.current;
      if (!container) return;

      const target =
        initialFocusRef?.current ??
        getFocusableElements(container)[0] ??
        container;

      target.focus();
    }

    const returnTargetRef = returnFocusRef?.current ?? null;

    requestAnimationFrame(focusInitial);

    if (lockScroll) {
      document.body.style.overflow = "hidden";
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !containerRef.current) return;

      const focusables = getFocusableElements(containerRef.current);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === containerRef.current) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (lockScroll) {
        document.body.style.overflow = "";
      }

      const returnTarget = returnTargetRef ?? previousFocusRef.current;
      returnTarget?.focus();
    };
  }, [
    isOpen,
    onClose,
    containerRef,
    returnFocusRef,
    initialFocusRef,
    lockScroll,
  ]);
}
