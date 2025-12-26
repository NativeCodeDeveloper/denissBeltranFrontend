"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import {ChevronDownIcon} from "lucide-react"
import {cn} from "@/lib/utils"

/* ================= ROOT ================= */

function Select(props) {
    return <SelectPrimitive.Root {...props} />
}

function SelectGroup(props) {
    return <SelectPrimitive.Group {...props} />
}

// IMPORTANTE: mantener data-slot para que tus clases lo encuentren
function SelectValue({className, ...props}) {
    return (
        <SelectPrimitive.Value
            data-slot="select-value"
            className={cn("text-black", className)}
            {...props}
        />
    )
}

/* ================= TRIGGER ================= */

function SelectTrigger({className, size = "default", children, ...props}) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(
                "w-full bg-white text-black",
                "[&>span]:text-black [&>span[data-placeholder]]:text-gray-400",
                "flex items-center justify-between gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs outline-none",
                "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "data-[size=default]:h-9 data-[size=sm]:h-8",
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon className="h-4 w-4 text-black"/>
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    )
}

/* ================= CONTENT ================= */

function SelectContent({className, children, ...props}) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                className={cn(
                    "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-300 bg-white text-black shadow-lg",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    className
                )}
                {...props}
            >
                <SelectPrimitive.Viewport className="p-1">
                    {children}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    )
}

/* ================= ITEM ================= */

function SelectItem({className, children, ...props}) {
    return (
        <SelectPrimitive.Item
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm",
                "text-black hover:bg-gray-100 focus:bg-gray-100 outline-none",
                "data-[state=checked]:bg-gray-100 data-[state=checked]:text-black",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            {...props}
        >
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    )
}

/* ================= EXPORTS ================= */

export {Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem}