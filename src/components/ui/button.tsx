import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 outline-none select-none active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_8px_18px_-10px_rgba(12,29,71,0.6)] hover:bg-navy-800",
        outline:
          "border-line bg-surface text-ink hover:border-ink/25 hover:bg-mist",
        secondary: "bg-mist text-ink hover:bg-sand",
        ghost: "text-ink hover:bg-ink/6",
        destructive:
          "border-destructive/30 bg-destructive/8 text-destructive hover:bg-destructive/15",
        link: "text-ink underline-offset-4 hover:underline",
        gold: "bg-gold text-ink shadow-[0_8px_18px_-10px_rgba(201,138,6,0.8)] hover:bg-[#f5bd3d]",
        /* On a navy panel: the gold action, or a quiet outlined one. */
        goldLight: "bg-gold text-ink hover:bg-[#f5bd3d]",
        outlineLight:
          "border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10",
      },
      size: {
        default: "h-10 gap-2 px-4",
        xs: "h-7 gap-1 px-2 text-xs",
        sm: "h-9 gap-1.5 px-3.5 text-[0.8125rem]",
        lg: "h-12 gap-2 px-6 text-[0.9375rem]",
        xl: "h-14 gap-2.5 px-8 text-base",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
