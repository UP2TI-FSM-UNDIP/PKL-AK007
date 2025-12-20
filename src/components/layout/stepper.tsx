import { clsx } from "clsx";

type StepperProps = {
  steps: string[];
  current: number; // 1-based index
};

export function Stepper({ steps, current }: StepperProps) {
  const progress =
    steps.length > 1 ? Math.max(0, Math.min(1, (current - 1) / (steps.length - 1))) : 0;

  return (
    <div className="relative px-2 py-3">
      <div className="absolute left-4 right-4 top-1/2 h-[2px] -translate-y-1/2 bg-gray-200" />
      <div
        className="absolute left-4 top-1/2 h-[2px] -translate-y-1/2 bg-[#0A77C8] transition-all duration-300"
        style={{ width: `calc(${progress * 100}% - 0px)` }}
      />

      <div className="relative flex items-center justify-between gap-4">
        {steps.map((step, index) => {
          const position = index + 1;
          const active = position === current;

          return (
            <div key={step} className="flex flex-col items-center gap-2 text-sm">
              <div
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
                  active ? "bg-[#0A77C8] text-white" : "bg-gray-200 text-gray-600"
                )}
              >
                {position}
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
