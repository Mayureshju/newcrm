import type { SlaBreachEvent } from "../../types/messenger";
import { Icon } from "./primitives";

export function SLABreachMarker({ event }: { event: SlaBreachEvent }) {
  const label =
    event.stage === "first_response"
      ? "SLA first response breached"
      : "SLA resolution breached";
  return (
    <div className="flex items-center justify-center py-1">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11.5px] text-rose-600">
        <Icon name="clock" className="size-3.5" />
        <span className="font-semibold">&quot;{event.policy}&quot;</span>
        <span className="font-medium">{label}</span>
      </span>
    </div>
  );
}
