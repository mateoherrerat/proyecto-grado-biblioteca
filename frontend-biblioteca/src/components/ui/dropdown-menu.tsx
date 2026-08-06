"use client"

import * as React from "react"
import { Menu as BaseMenu } from "@base-ui/react/menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const DropdownMenu = BaseMenu.Root

const DropdownMenuTrigger = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return <BaseMenu.Trigger ref={ref as any} render={children as any} {...props} />
  }
  return <BaseMenu.Trigger ref={ref as any} {...props}>{children}</BaseMenu.Trigger>
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuPortal = BaseMenu.Portal

const DropdownMenuPositioner = BaseMenu.Positioner

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> & {
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    sideOffset?: number
  }
>(({ className, side, align, sideOffset = 12, children, ...props }, ref) => (
  <DropdownMenuPortal>
    <DropdownMenuPositioner side={side} align={align} sideOffset={sideOffset} className="z-[9999]">
      <BaseMenu.Popup
        ref={ref as any}
        className={cn(
          "z-[9999] min-w-[8rem] overflow-hidden rounded-2xl border border-border/80 bg-popover p-1 text-popover-foreground shadow-2xl transition-all mt-3",
          className
        )}
        {...props}
      >
        {children}
      </BaseMenu.Popup>
    </DropdownMenuPositioner>
  </DropdownMenuPortal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Item> & { asChild?: boolean }
>(({ className, asChild, children, ...props }, ref) => {
  const itemClasses = cn(
    "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )
  if (asChild && React.isValidElement(children)) {
    return (
      <BaseMenu.Item
        ref={ref as any}
        className={itemClasses}
        render={children as any}
        {...props}
      />
    )
  }
  return (
    <BaseMenu.Item
      ref={ref as any}
      className={itemClasses}
      {...props}
    >
      {children}
    </BaseMenu.Item>
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseMenu.Separator
    ref={ref as any}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) => (
  <div
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuGroup = BaseMenu.Group

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
}
