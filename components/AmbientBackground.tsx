type AmbientBackgroundProps = {
  intensity?: "soft" | "medium" | "strong";
  placement?: "top-right" | "center" | "bottom-left";
};

export function AmbientBackground({
  intensity = "soft",
  placement = "top-right",
}: AmbientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`ambient ambient--${intensity} ambient--${placement}`}
    />
  );
}
