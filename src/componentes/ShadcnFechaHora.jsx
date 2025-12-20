"use client"

import * as React from "react"
import {ChevronDownIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function ShadcnFechaHora({onChange}) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState(undefined)
    const [time, setTime] = React.useState("10:30")

    const dateTime = React.useMemo(() => {
        if (!date) return null

        const [hh = 0, mm = 0, ss = 0] = time.split(":").map(Number)

        const d = new Date(date)
        d.setHours(hh, mm, ss, 0)
        return d
    }, [date, time])

    // 🔔 Notificar al padre
    React.useEffect(() => {
        if (dateTime && onChange) {
            onChange(dateTime)
        }
    }, [dateTime, onChange])

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Label className="px-1">Fecha</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        {/* Botón de fecha: azul oscuro con texto blanco */}
                        <Button variant="outline"
                                className="w-32 justify-between font-normal bg-blue-900 text-white hover:bg-blue-800">
                            {date ? date.toLocaleDateString() : "Seleccionar"}
                            <ChevronDownIcon/>
                        </Button>
                    </PopoverTrigger>
                    {/* Contenido del popover: fondo azul y texto blanco */}
                    <PopoverContent className="w-auto p-0">
                        <div className="bg-blue-900 text-white p-3 rounded-md">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                    setDate(d)
                                    setOpen(false)
                                }}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col gap-3">
                <Label className="px-1">Hora</Label>
                {/* Input hora estilizado como botón azul con texto blanco */}
                <Input
                    type="time"
                    step="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-32 bg-blue-900 text-white rounded-md px-3 py-2"
                />
            </div>
        </div>
    )
}