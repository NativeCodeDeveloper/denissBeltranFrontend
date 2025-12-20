"use client"
import {useState, useEffect} from "react";
import {useParams} from "next/navigation";
import ToasterClient from "@/componentes/ToasterClient";
import {toast} from "react-hot-toast";
import {ShadcnButton} from "@/componentes/shadcnButton";
import {ShadcnInput} from "@/componentes/shadcnInput";

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {Textarea} from "@/components/ui/textarea";

export default function AgendaDetalle() {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const {id_reserva} = useParams();
    const [dataReservaId, setDataReservaId] = useState([]);

    async function seleccionarEspecifica(id_reserva) {
        try {

            const res = await fetch(`${API}/reservaPacientes/seleccionarEspecifica`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_reserva}),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("Ha ocurrido un error en el servidor");
            } else {

                const dataEspecifica = await res.json();

                if (Array.isArray(dataEspecifica)) {
                    setDataReservaId(dataEspecifica);
                } else {
                    return toast.error("Ha ocurrido un error en el servidor");
                }
            }
        } catch (e) {
            return toast.error("Problema en el servidor, contacte a soporte.");
        }
    }

    useEffect(() => {
        seleccionarEspecifica(id_reserva)
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <ToasterClient/>

            <div className="mx-auto max-w-6xl px-6 py-10">


                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-indigo-500 to-emerald-400 bg-clip-text text-transparent">
                    Agenda Detalle
                </h1>


                <div
                    className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-2xl border border-gray-200 shadow-sm bg-white">
                    <div className="rounded-xl border border-gray-200 p-6">
                        {dataReservaId.map(data => (
                            <div key={data.id_reserva} className="flex flex-col gap-2 list-none">
                                <h2 className="font-semibold text-xl text-sky-800">Información de la reserva</h2>
                                <li><span className="font-bold text-sky-800">Nombre: </span> {data.nombrePaciente}</li>
                                <li><span className="font-bold text-sky-800 ">Apellido: </span>{data.apellidoPaciente}
                                </li>
                                <li><span className="font-bold text-sky-800">RUT: </span>{data.rut}</li>
                                <li><span className="font-bold text-sky-800">Telefono: </span>{data.telefono}</li>
                                <li><span className="font-bold text-sky-800">Correo: </span>{data.email}</li>
                                <li className=""><span
                                    className="font-bold text-sky-800">Fecha Inicio: </span>{data.fechaInicio}
                                </li>
                                <li><span
                                    className="font-bold text-sky-800">Fecha Finalizacion: </span>{data.fechaFinalizacion}
                                </li>
                                <li><span className="font-bold text-sky-800">Hora: </span>{data.horaInicio}</li>
                                <li><span className="font-bold text-sky-800">Estado: </span>{data.estadoReserva}</li>
                            </div>
                        ))}
                    </div>


                    <div className="space-y-5 rounded-xl border border-gray-200 p-6 bg-white">
                        <div>
                            <label htmlFor="tituloCorreo"
                                   className="block text-base font-semibold text-sky-700 mb-2">
                                Asunto del correo
                            </label>
                            <ShadcnInput
                                placeholder="Ej: Actualización de tu pedido #123"
                                className="w-full border-gray-300 focus:ring-sky-300"
                            />
                        </div>


                        <div>
                            <label htmlFor="mensajeCorreo"
                                   className="block text-base font-semibold text-sky-700 mb-2">
                                Mensaje
                            </label>
                            <Textarea

                                id="mensajeCorreo"
                                placeholder="Escribe aquí el mensaje para el cliente..."
                                className="w-full text-sm min-h-[160px] resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <ShadcnButton
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition"
                                nombre="Enviar Seguimiento"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex gap-6">

                    <Select>
                        <SelectTrigger className="w-100">
                            <SelectValue placeholder="Selecciona un estado para la cita"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fruits</SelectLabel>
                                <SelectItem value="apple">Finalizada</SelectItem>
                                <SelectItem value="banana">Reservada</SelectItem>
                                <SelectItem value="blueberry">Cancelada</SelectItem>
                                <SelectItem value="grapes">Anulada</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <ShadcnButton nombre={"Actualizar Estado"}/>

                    <ShadcnButton nombre={"Actualizar Estado"}/>
                </div>


            </div>

        </div>
    )
}