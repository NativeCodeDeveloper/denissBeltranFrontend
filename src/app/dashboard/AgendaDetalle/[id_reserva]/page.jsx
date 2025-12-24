"use client"
import {useState, useEffect} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import ToasterClient from "@/componentes/ToasterClient";
import {toast} from "react-hot-toast";
import ShadcnButton from "@/componentes/shadcnButton";
import ShadcnInput from "@/componentes/shadcnInput";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales";

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
import ShadcnButton2 from "@/componentes/shadcnButton2";

export default function AgendaDetalle() {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const {id_reserva} = useParams();
    const [dataReservaId, setDataReservaId] = useState([]);
    const [estadoReserva, setEstadoReserva] = useState("");
    const [mensajeEliminacion, setmensajeEliminacion] = useState("");
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

    const [asunto, setAsunto] = useState("Recordatorio Cita Telemedicina");
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("Estimado/a [Nombre del paciente],\n" +
        "\n" +
        "Le recordamos que tiene una cita de telemedicina agendada para hoy [fecha] a las [hora].\n" +
        "\n" +
        "Por favor, procure conectarse con 5 minutos de anticipación y verificar previamente su conexión a internet y dispositivo.\n" +
        "\n" +
        "Ante cualquier duda o inconveniente, no dude en contactarnos.\n" +
        "\n" +
        "Atentamente,\n" +
        "[Nombre del profesional o centro de salud]\n");


    async function seguimientoCliente(asunto, email, mensaje) {
        try {
            if (!asunto || !email || !mensaje) {
                return toast.error('Para hacer el seguimiento debe llenar todos los campos de texto');
            }

            const res = await fetch(`${API}/correo/seguimiento`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({asunto, email, mensaje}),
                cache: "no-cache"
            })
            if (!res.ok) {
                return toast.error('El correo del cliente NO es valido. No existe.');
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.message === true) {
                return toast.success("Se ha realziado seguimiento correctamente. Se ha enviado mensaje de seguimiento al correo.")
            } else {
                return toast.error('El correo del cliente NO es valido. No existe.');
            }

        } catch (error) {
            return toast.error('Ha ocurrido un error porfavor contacte a soporte de NativeCode');
        }
    }


    useEffect(() => {
        dataReservaId.map((paciente) => {
            setEmail(paciente.email);
        })
    }, [dataReservaId]);


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


    async function eliminadoLogicoReserva(id_reserva) {
        try {

            if (!id_reserva) {
                return toast.error("Debe seleccionar al menos una reserva valida para realizar la eliminacion")
            }

            const res = await fetch(`${API}/reservaPacientes/eliminarReserva`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_reserva}),
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("No hay conexion con el servidor por favor contacte a Soporte");

            } else {

                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    setmensajeEliminacion("Esta reserva ha sido eliminada. Ya no podra acceder a la informacion de esta cita.")
                    return toast.success("Se ha eliminado con exito la reserva");
                } else if (respuestaBackend.message === false) {
                    return toast.success("No se ha podido eliminar la reserva. Intente mas tarde.");
                } else {
                    return toast.error("No hay conexion con el servidor por favor contacte a Soporte");
                }
            }

        } catch (error) {
            console.log(error);
            return toast.error("No hay conexion con el servidor por favor contacte a Soporte");
        }
    }


    async function actualizarReservaPaciente(estadoReserva, id_reserva) {
        try {

            if (!id_reserva || !estadoReserva) {
                return toast.error("Debe seleccionar un nuevo estado")
            }


            const res = await fetch(`${API}/reservaPacientes/actualizarEstado`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({estadoReserva, id_reserva}),
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("No se ha podido enviar la informaicon para actualizar el estado");

            } else {

                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    await seleccionarEspecifica(id_reserva)
                    return toast.success("Se ha actualizado el estado con exito");
                } else {
                    return toast.error("No se ha podido actualizar. Intente Mas tarde.");

                }
            }
        } catch (e) {
            console.log(e);
            return toast.error("No hay conexion con el servidor por favor contacte a Soporte");
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <ToasterClient/>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">


                <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-sky-600 via-indigo-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                    Agenda Detalle
                </h1>


                <div
                    className="mt-6 inline-flex w-full sm:w-auto rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur p-4 shadow-sm">
                    {dataReservaId.map(data => (
                        <div key={data.id_reserva} className="flex flex-col gap-2 list-none">
                            <li><span className="font-bold text-gray-800">Estado Reserva : </span><span

                                className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-sky-700 font-bold ring-1 ring-sky-100">{data.estadoReserva}</span>
                            </li>
                        </div>
                    ))}
                </div>


                <div
                    className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-5 sm:p-8 rounded-3xl border border-gray-200/70 bg-white/70 backdrop-blur shadow-[0_8px_30px_rgba(2,6,23,0.06)]">
                    <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
                        {dataReservaId.map(data => (
                            <div key={data.id_reserva} className="flex flex-col gap-2 list-none">
                                <h2 className="text-lg sm:text-xl font-bold text-sky-900 tracking-tight">Información de
                                    la reserva</h2>
                                <li><span className="font-semibold text-sky-900">Nombre: </span> {data.nombrePaciente}
                                </li>
                                <li><span
                                    className="font-semibold text-sky-900">Apellido: </span>{data.apellidoPaciente}
                                </li>
                                <li><span className="font-semibold text-sky-900">RUT: </span>{data.rut}</li>
                                <li><span className="font-semibold text-sky-900">Telefono: </span>{data.telefono}</li>
                                <li><span className="font-semibold text-sky-900">Correo: </span>{data.email}</li>
                                <li className=""><span
                                    className="font-semibold text-sky-900">Fecha Inicio: </span>{formatearFecha(data.fechaInicio)}
                                </li>
                                <li><span
                                    className="font-semibold text-sky-900">Fecha Finalizacion: </span>{formatearFecha(data.fechaFinalizacion)}
                                </li>
                                <li><span className="font-semibold text-sky-900">Hora: </span>{data.horaInicio}</li>
                            </div>
                        ))}
                    </div>


                    <div className="space-y-5 rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
                        <div>
                            <label htmlFor="tituloCorreo"
                                   className="block text-sm font-semibold text-sky-800 mb-2">
                                Asunto del correo
                            </label>
                            <ShadcnInput
                                placeholder="Ej: Recordatorio Cita Telemedicina"
                                value={asunto}
                                onChange={(e) => setAsunto(e.target.value)}
                                className="w-full border-gray-200 focus:ring-sky-300 focus:border-sky-300"
                            />
                        </div>


                        <div>
                            <label htmlFor="mensajeCorreo"
                                   className="block text-sm font-semibold text-sky-800 mb-2">
                                Mensaje
                            </label>
                            <Textarea
                                id="mensajeCorreo"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Escribe aquí el mensaje para el Paciente..."
                                className="w-full text-sm min-h-[180px] resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                            <ShadcnButton
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition active:scale-[0.99]"
                                nombre="Enviar Seguimiento"
                                funcion={() => seguimientoCliente(asunto, email, mensaje)}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center rounded-3xl border border-gray-200/70 bg-white/70 backdrop-blur p-4 sm:p-5 shadow-sm">

                    <Select value={estadoReserva} onValueChange={(value) => setEstadoReserva(value)}>
                        <SelectTrigger
                            className="w-full sm:w-[340px] bg-white border border-gray-200 text-slate-900 shadow-sm rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300">
                            <SelectValue placeholder="Selecciona un estado para la cita"/>
                        </SelectTrigger>
                        <SelectContent
                            className="z-50 bg-white text-slate-900 border border-gray-200 shadow-xl rounded-2xl">
                            <SelectGroup>
                                <SelectItem className="cursor-pointer rounded-lg focus:bg-sky-50 focus:text-slate-900"
                                            value="Finalizada">Finalizada</SelectItem>
                                <SelectItem className="cursor-pointer rounded-lg focus:bg-sky-50 focus:text-slate-900"
                                            value="Reservada">Reservada</SelectItem>
                                <SelectItem className="cursor-pointer rounded-lg focus:bg-sky-50 focus:text-slate-900"
                                            value="Cancelada">Cancelada</SelectItem>
                                <SelectItem className="cursor-pointer rounded-lg focus:bg-sky-50 focus:text-slate-900"
                                            value="Anulada">Anulada</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <ShadcnButton nombre={"Actualizar Estado"}
                                  funcion={() => actualizarReservaPaciente(estadoReserva, id_reserva)}/>

                    <ShadcnButton2
                        className="bg-red-600 hover:bg-red-500 rounded-xl shadow-sm hover:shadow-md transition active:scale-[0.99]"
                        nombre={"Eliminar Reserva"}
                        funcion={() => setConfirmarEliminacion(true)}
                    />

                    <Link href={"/dashboard/GestionAgendas"}>
                        <ShadcnButton2
                            className="bg-green-600 hover:bg-green-500 rounded-xl shadow-sm hover:shadow-md transition active:scale-[0.99]"
                            nombre={"Retroceder"}
                        />
                    </Link>
                </div>

                {confirmarEliminacion && (
                    <div className="w-full sm:w-auto">
                        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                            <p className="text-sm font-semibold text-red-800">
                                ¿Está seguro de que desea eliminar la cita seleccionada?
                            </p>
                            <p className="mt-1 text-xs text-red-700/80">
                                Esta acción no se puede deshacer.
                            </p>

                            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setConfirmarEliminacion(false);
                                        eliminadoLogicoReserva(id_reserva);
                                    }}
                                    className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 transition active:scale-[0.99]"
                                >
                                    Sí, eliminar
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setConfirmarEliminacion(false)}
                                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition"
                                >
                                    Retroceder
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {mensajeEliminacion && (
                    <div className="flex items-center gap-3 mt-5">
                        <h1 className="text-2xl font-bold text-red-600">{mensajeEliminacion}</h1>
                    </div>
                )}

            </div>

        </div>
    )
}