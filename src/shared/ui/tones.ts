/** Shared semantic tones for Badge / Alert / related chrome. */
export type AppTone =
  | "accent"
  | "primary"
  | "secondary"
  | "error"
  | "success"
  | "warning"
  | "info"
  | "muted";

export function toneTonalClasses(tone: AppTone): string {
  switch (tone) {
    case "accent":
      return "bg-accent-variant text-accent";
    case "primary":
      return "bg-primary-variant text-primary";
    case "secondary":
      return "bg-secondary-variant text-secondary";
    case "error":
      return "bg-error-variant text-error";
    case "success":
      return "bg-success-variant text-success";
    case "warning":
      return "bg-warning-variant text-warning";
    case "info":
      return "bg-info-variant text-info";
    default:
      return "bg-surface-variant text-muted";
  }
}

export function toneOutlinedClasses(tone: AppTone): string {
  switch (tone) {
    case "accent":
      return "border border-accent/40 text-accent bg-transparent";
    case "primary":
      return "border border-primary/40 text-primary bg-transparent";
    case "secondary":
      return "border border-secondary/40 text-secondary bg-transparent";
    case "error":
      return "border border-error/40 text-error bg-transparent";
    case "success":
      return "border border-success/40 text-success bg-transparent";
    case "warning":
      return "border border-warning/40 text-warning bg-transparent";
    case "info":
      return "border border-info/40 text-info bg-transparent";
    default:
      return "border border-border text-muted bg-transparent";
  }
}
