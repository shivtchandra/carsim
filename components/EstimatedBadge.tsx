export default function EstimatedBadge({
  tooltip = "Preview telemetry uses modeled figures here, not a fully instrumented test result.",
  label = "~ preview",
}: {
  tooltip?: string;
  label?: string;
}) {
  return (
    <span className="badge-estimated" title={tooltip}>
      {label}
    </span>
  );
}
