"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b border-b-black/20", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center text-left py-4 font-sans text-lg font-black uppercase transition-all hover:opacity-80",
        className,
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className="overflow-hidden text-base" {...props}>
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: 1,
        height: "auto",
        transition: {
          height: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.2, delay: 0.1 },
        },
      }}
      exit={{
        opacity: 0,
        height: 0,
        transition: {
          height: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.2 },
        },
      }}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </motion.div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
