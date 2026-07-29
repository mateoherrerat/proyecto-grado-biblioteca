"use client"

import * as React from "react"
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"

function TooltipProvider({ children, delayDuration }: { children: React.ReactNode; delayDuration?: number }) {
  return <BaseTooltip.Provider delay={delayDuration}>{children}</BaseTooltip.Provider>
}

function Tooltip({ ...props }: React.ComponentProps<typeof BaseTooltip.Root>) {
  return <BaseTooltip.Root {...props} />
}

function TooltipTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Trigger> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return <BaseTooltip.Trigger render={children as any} {...props} />
  }
  return <BaseTooltip.Trigger {...props}>{children}</BaseTooltip.Trigger>
}

function TooltipContent({
  className,
  side,
  align,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup> & {
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseTooltip.Popup
          className={cn(
            "z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md transition-all",
            className
          )}
          {...props}
        >
          {children}
          <BaseTooltip.Arrow className="size-2 bg-foreground rotate-45" />
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
