import { clsx } from "clsx";

type StepperProps = {
  steps: string[];
  current: number; // 1-based index
};

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const position = index + 1;
          const active = position === current;
          const completed = position < current;

          return (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  completed && "bg-[#0A77C8] text-white",
                  active && !completed && "border-2 border-[#0A77C8] bg-white text-[#0A77C8]",
                  !completed && !active && "border border-gray-300 bg-gray-100 text-gray-400"
                )}
              >
                {position}
              </div>
              <div className="flex flex-1 flex-col">
                <span
                  className={clsx(
                    "text-sm font-semibold",
                    active ? "text-[#0A77C8]" : "text-gray-600"
                  )}
                >
                  {step}
                </span>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={clsx(
                    "h-px flex-1",
                    completed ? "bg-[#0A77C8]" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
