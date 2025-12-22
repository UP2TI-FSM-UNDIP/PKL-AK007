import { cn } from "@/lib/utils"

interface Step {
  label: string
}

interface FormStepperProps {
  steps: Step[]
  currentStep: number
}

export function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <div className="mb-12 mt-8">
      <div className="relative flex justify-between items-start">
        {/* Connecting Line */}
        <div className="absolute top-4 left-0 w-full px-12">
          <div className="h-[2px] w-full bg-[#D1D5DB]"></div>
        </div>

        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={index} className="relative flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  (isActive || isCompleted)
                    ? "bg-[#0078C9] text-white"
                    : "bg-[#D1D5DB] text-slate-500"
                )}
              >
                {stepNumber}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 text-center",
                  isActive ? "text-[#0078C9] font-bold" : "text-slate-500 font-medium"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
