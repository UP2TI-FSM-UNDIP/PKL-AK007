import { clsx } from "clsx";
import { Check } from "lucide-react";

type StepperProps = {
  steps: string[];
  current: number; // 1-based index
};

export function Stepper({ steps, current }: StepperProps) {
  const progress =
    steps.length > 1 ? Math.max(0, Math.min(1, (current - 1) / (steps.length - 1))) : 0;

  return (
    <div className="relative px-4 pb-3 pt-2">
      <div className="absolute left-15 right-15 top-[23px] h-[2px] bg-gray-200" />
      <div className="absolute left-15 right-15 top-[23px] h-[2px] overflow-hidden">
        <div
          className="h-full bg-[#0A77C8] transition-[width] duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="relative flex items-center justify-between gap-4">
        {steps.map((step, index) => {
          const position = index + 1;
          const completed = position < current;
          const active = position === current;

          return (
            <div key={step} className="flex flex-col items-center gap-2 text-sm">
              <div
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
                  completed && "bg-[#0A77C8] text-white",
                  active && !completed && "bg-[#0A77C8] text-white",
                  !completed && !active && "bg-gray-200 text-gray-600"
                )}
              >
                {completed ? <Check size={16} strokeWidth={2.5} /> : position}
              </div>
              <span
                className={clsx(
                  "font-semibold",
                  active ? "text-[#0A77C8]" : "text-gray-600"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
