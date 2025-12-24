"use client"
import {useState, useEffect} from "react";
import ShadcnInput from "@/componentes/shadcnInput";
import ShadcnButton from "@/componentes/shadcnButton";
import ToasterClient from "@/componentes/ToasterClient";
import toast from "react-hot-toast";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales";
import ShadcnButton2 from "@/componentes/shadcnButton2";
import {useRouter} from "next/navigation";
import {Calendar28} from "@/componentes/shadcnCalendarSelector";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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


export default function GestionAgendas() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [dataLista, setdataLista] = useState([]);
    const [nombrePaciente, setnombrePaciente] = useState("");
    const [rut, setrut] = useState("");
    const [fechaInicio, setfechaInicio] = useState(null); // Date | null
    const [fechaFinalizacion, setfechaFinalizacion] = useState(null); // Date | null
    const [estadoReserva, setestadoReserva] = useState("");

    function verDetalleAgenda(id_reserva) {
        router.push(`/dashboard/AgendaDetalle/${id_reserva}`);
    }


    async function buscarEntreFechas(fechaInicio, fechaFinalizacion) {
        try {
            if (!fechaInicio || !fechaFinalizacion) {
                return toast.error("Debe seleccionar un rango de fechas para filtrar")
            }

            const res = await fetch(`${API}/reservaPacientes/buscarEntreFechas`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({fechaInicio, fechaFinalizacion}),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("Debe ingresar Fechas para filtrar.");

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend) {
                    setdataLista(respuestaBackend);
                    return toast.success("No se encontraron citas en el periodo Seleccionado")

                } else if (respuestaBackend.message === 'sindata') {

                    return toast.error("No se han encontrado similitudes de nombres")

                } else {

                    return toast.error("No se han encontrado similitudes de nombres")
                }
            }

        } catch (error) {
            console.log(error);
            return toast.error("No ha sido posible buscar la similitud por nombres, porfavor contacte a soporte Tecnico de Medify");
        }

    }


    async function buscarPorRut(rut) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarRut`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({rut}),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("Debe ingresar datos para filtrar.");

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.length > 0) {
                    setdataLista(respuestaBackend);
                    return toast.success("Similtud de nombre encontrada")

                } else if (respuestaBackend.message === 'sindata') {

                    return toast.error("No se han encontrado similitudes de nombres")

                } else {

                    return toast.error("No se han encontrado similitudes de nombres")
                }
            }

        } catch (error) {
            console.log(error);
            return toast.error("No ha sido posible buscar la similitud por nombres, porfavor contacte a soporte Tecnico de Medify");
        }

    }


    async function buscarPorNombres(nombrePaciente) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarNombre`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({nombrePaciente}),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("Debe ingresar datos para filtrar.");
            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.length > 0) {

                    setdataLista(respuestaBackend);

                    return toast.success("Similtud de nombre encontrada")

                } else if (respuestaBackend.message === 'sindata') {

                    return toast.error("No se han encontrado similitudes de nombres")

                } else {

                    return toast.error("No se han encontrado similitudes de nombres")
                }
            }

        } catch (error) {
            console.log(error);
            return toast.error("No ha sido posible buscar la similitud por nombres, porfavor contacte a soporte Tecnico de Medify");
        }

    }


    async function listarTablaCitas() {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarReservados`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors"
            });

            const respuestaBackend = await res.json();
            if (respuestaBackend) {
                setdataLista(respuestaBackend);
            }

        } catch (err) {
            console.log(err);
            return toast.error(err.message);
        }
    }


    useEffect(() => {
        listarTablaCitas();
    }, []);


    async function filtrarEstados(estadoReserva) {
        try {
            if (!estadoReserva) {
                return toast.error("Debe seleccionar un estado de reserva.");
            }

            const res = await fetch(`${API}/reservaPacientes/seleccionarSegunEstado`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({estadoReserva}),
                mode: "cors",
                cache: "no-cache"
            })


            if (!res.ok) {
                return toast.error("Debe seleccionar un estado de reserva.");
            } else {
                const dataBackend = await res.json();
                if (dataBackend.length > 0) {
                    setdataLista(dataBackend);
                } else {
                    return toast.error("No se han encontrado similitudes con el estado seleccionado")
                }
            }
        } catch (error) {
            console.log(error);
            return toast.error(error.message);
        }
    }


    useEffect(() => {
        if (!estadoReserva) {
            return;
        } else {
            filtrarEstados(estadoReserva)
        }

    }, [estadoReserva]);


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-6 md:px-8">
            <ToasterClient/>
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-5 flex flex-col gap-1">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                        Gestión de Agenda
                    </h1>
                    <p className="text-sm md:text-base text-slate-600">
                        Filtra pacientes por nombre, RUT o rango de fechas para revisar rápidamente los citados.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">
                                    Buscar por similitud de nombre
                                </label>
                                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="flex-1">
                                        <ShadcnInput
                                            value={nombrePaciente}
                                            onChange={(e) => setnombrePaciente(e.target.value)}
                                        />
                                    </div>
                                    <div className="sm:w-auto">
                                        <ShadcnButton2 className="bg-blue-950" nombre={"Buscar"}
                                                       funcion={() => buscarPorNombres(nombrePaciente)}/>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700">
                                    Buscar por similitud de RUT
                                </label>
                                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="flex-1">
                                        <ShadcnInput value={rut}
                                                     onChange={(e) => setrut(e.target.value)}/>
                                    </div>
                                    <div className="sm:w-auto">
                                        <ShadcnButton2 className="bg-blue-950" nombre={"Buscar"}
                                                       funcion={() => buscarPorRut(rut)}/>
                                    </div>
                                </div>

                                <div className="sm:w-auto mt-10">
                                    <ShadcnButton2 className="bg-blue-950" nombre={"Mostrar todos los Paciente"}
                                                   funcion={() => listarTablaCitas()}/>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 md:p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-slate-800">
                                    Buscar entre fechas
                                </h2>
                                <span className="text-xs text-slate-500">
                                    Desde / Hasta
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <Calendar28
                                    nombre={"Fecha de Inicio"}
                                    value={fechaInicio}
                                    onChange={(date) => setfechaInicio(date)}
                                />

                                <Calendar28
                                    nombre={"Fecha de Término"}
                                    value={fechaFinalizacion}
                                    onChange={(date) => setfechaFinalizacion(date)}
                                />

                            </div>

                            <div className="mt-4">
                                <ShadcnButton2
                                    className="bg-blue-950"
                                    nombre={"Buscar"}
                                    funcion={() => buscarEntreFechas(fechaInicio, fechaFinalizacion)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-8 w-full max-w-6xl rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                    <div className="space-y-0.5">
                        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
                            Listado de pacientes citados
                        </h1>
                        <p className="text-sm text-slate-600">
                            Revisa el detalle por fecha, paciente, RUT y estado.
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <Select value={estadoReserva} onValueChange={(value) => setestadoReserva(value)}>
                            <SelectTrigger
                                className="h-10 w-full md:w-[220px] bg-white opacity-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm">
                                <SelectValue placeholder="Estados de las citas "/>
                            </SelectTrigger>
                            <SelectContent
                                className="bg-white opacity-100 backdrop-blur-none border border-slate-200 shadow-lg z-50">
                                <SelectGroup>
                                    <SelectItem value="reservada">Reservada</SelectItem>
                                    <SelectItem value="anulada">Anulada</SelectItem>
                                    <SelectItem value="confirmada">Confirmada</SelectItem>
                                    <SelectItem value="completada">Completada</SelectItem>
                                    <SelectItem value="pendiente pago">Pendiente</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="px-5 pb-5 md:px-6 md:pb-6 overflow-x-auto">
                    <Table>
                        <TableCaption>Listado de Pacientes ingresados</TableCaption>
                        <TableHeader className="bg-slate-900 text-white">
                            <TableRow>
                                <TableHead
                                    className="text-center font-semibold uppercase tracking-wide text-[11px] text-white/90">FECHA</TableHead>
                                <TableHead
                                    className="text-center font-semibold uppercase tracking-wide text-[11px] text-white/90">PACIENTE</TableHead>
                                <TableHead
                                    className="text-center font-semibold uppercase tracking-wide text-[11px] text-white/90">RUT</TableHead>
                                <TableHead
                                    className="text-center font-semibold uppercase tracking-wide text-[11px] text-white/90">ESTADO</TableHead>
                                <TableHead
                                    className="text-center font-semibold uppercase tracking-wide text-[11px] text-white/90">Detalle
                                    de La
                                    Reunion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataLista.map((data) => (
                                <TableRow key={data.id_reserva} className="hover:bg-slate-50/70 transition-colors">
                                    <TableCell
                                        className="text-center whitespace-nowrap text-sm font-medium text-slate-900">{formatearFecha(data.fechaInicio)}</TableCell>
                                    <TableCell
                                        className="text-center whitespace-nowrap text-sm text-slate-700">{data.nombrePaciente + " " + data.apellidoPaciente}</TableCell>
                                    <TableCell
                                        className="text-center whitespace-nowrap text-sm text-slate-700">{data.rut}</TableCell>
                                    <TableCell
                                        className="text-center whitespace-nowrap text-sm font-semibold text-slate-900">{data.estadoReserva}</TableCell>
                                    <TableCell className="flex justify-center">
                                        <ShadcnButton2 className="bg-blue-950"
                                                       funcion={() => verDetalleAgenda(data.id_reserva)}
                                                       nombre={"Seleccionar"}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </div>
            </div>

        </div>
    )
}