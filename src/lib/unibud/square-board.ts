/** True when the event target is (or sits inside) a real control — those keep their own behavior. */
export function isSquareInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      [
        "a",
        "button",
        "input",
        "textarea",
        "select",
        "label",
        "summary",
        "video",
        "audio",
        '[role="button"]',
        '[role="link"]',
        '[role="tab"]',
        '[role="menuitem"]',
        "[data-square-interactive]",
        '[contenteditable="true"]',
      ].join(","),
    ),
  );
}
