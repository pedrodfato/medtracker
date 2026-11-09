import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

// Shared with native <select> elements so every field looks the same.
export const inputClasses =
    "h-12 w-full min-w-0 rounded-2xl border border-white/80 bg-white/60 px-4 text-[15px] text-gray-900 shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] backdrop-blur-md transition outline-none placeholder:text-gray-400 hover:bg-white/75 focus-visible:border-primary focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-4 aria-invalid:ring-red-400/15"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputClasses, className)}
      {...props}
    />
  )
}

export { Input }
