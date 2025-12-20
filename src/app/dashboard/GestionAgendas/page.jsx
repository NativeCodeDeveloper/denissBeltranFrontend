"use client"
import {useState, useEffect} from "react";
import ShadcnInput from "@/componentes/shadcnInput";
import ShadcnButton from "@/componentes/shadcnButton";
import ShadcnCalendarSelector from "@/componentes/shadcnCalendarSelector";

export default function GestionAgendas() {
    return (
        <div>
            <h1 className="text-4xl font-bold">Gestion Agenda</h1>
            <br/>

            <div className="border-1  p-8 grid grid-cols-2">
                <div>
                    <div>
                        <label htmlFor="genda">Buscar por Similitud Nombre</label>

                        <div className="flex gap-2">
                            <ShadcnInput/>
                            <ShadcnButton nombre={"Buscar"}/>
                        </div>
                    </div>


                    <div className="mt-2">
                        <label htmlFor="genda">Buscar por Similitud RUT</label>

                        <div className="flex  gap-2 ">
                            <ShadcnInput/>
                            <ShadcnButton nombre={"Buscar"}/>
                        </div>
                    </div>

                </div>


                <div className="p-8">
                    <div className="flex gap-4">
                        <h1>Buscar entre Fechas</h1>


                    </div>
                    <div className="flex gap-4 mt-3
                    ">
                        <ShadcnCalendarSelector/>
                        <ShadcnCalendarSelector/>
                    </div>
                    <br/>
                    <ShadcnButton nombre={"Buscar"}/>

                </div>
            </div>

        </div>
    )
}