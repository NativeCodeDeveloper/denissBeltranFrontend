"use client"

import * as React from "react"
import {CalendarIcon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function formatISODateOnly(date) {
    if (!date) return null
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

function isValidDate(date) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

export function Calendar28({nombre, onChange}) {
    const [open, setOpen] = React.useState(false)

    // Fecha base (evita re-crear instancias distintas en renders inesperados)
    const initialDate = React.useMemo(() => new Date("2025-06-01"), [])

    const [date, setDate] = React.useState(initialDate)
    const [month, setMonth] = React.useState(initialDate)

    // `value` es el texto del input (puede diferir mientras el usuario escribe)
    const [value, setValue] = React.useState(formatDate(initialDate))

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {nombre}
            </Label>
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    value={value}
                    placeholder="June 01, 2025"
                    className="bg-white text-slate-900 border border-gray-200 rounded-md pr-10 py-2 shadow-sm"
                    onChange={(e) => {
                        const nextValue = e.target.value
                        setValue(nextValue)

                        // Intentamos interpretar lo que escribió el usuario.
                        // Si es una fecha válida, sincronizamos date y month.
                        const parsed = new Date(nextValue)
                        if (isValidDate(parsed)) {
                            setDate(parsed)
                            setMonth(parsed)
                            onChange?.(formatISODateOnly(parsed))
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5"/>
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-3 bg-white text-slate-900 rounded-lg border border-gray-200 shadow-lg"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={(nextMonth) => {
                                // Evita setState innecesario (previene loops en algunos casos con DayPicker)
                                setMonth((prev) =>
                                    prev?.getTime?.() === nextMonth?.getTime?.() ? prev : nextMonth
                                )
                            }}
                            onSelect={(selectedDate) => {
                                if (!selectedDate) return

                                setDate(selectedDate)
                                setMonth(selectedDate)
                                setValue(formatDate(selectedDate))
                                setOpen(false)

                                // 🔹 Devuelve la fecha en formato YYYY-MM-DD
                                onChange?.(formatISODateOnly(selectedDate))
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
