"use client"

import * as React from "react"
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible"

function Collapsible({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Root> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>
    return React.cloneElement(child, {
      ...(child.props || {}),
      children: <BaseCollapsible.Root {...props}>{child.props?.children}</BaseCollapsible.Root>
    })
  }
  return <BaseCollapsible.Root {...props}>{children}</BaseCollapsible.Root>
}

function CollapsibleTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <BaseCollapsible.Trigger {...props} render={children as any} />
    )
  }
  return <BaseCollapsible.Trigger {...props}>{children}</BaseCollapsible.Trigger>
}

function CollapsibleContent({ ...props }: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return <BaseCollapsible.Panel {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
