"use client"
import {useEffect, useState} from "react";
import ShadcnInput from "@/componentes/shadcnInput";
import ShadcnButton2 from "@/componentes/shadcnButton2";
import {useAgenda} from "@/ContextosApp/AgendaContext";
import ToasterClient from "@/componentes/ToasterClient";
import {toast} from "react-hot-toast";
import Image from "next/image";


import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";

export default function FormularioPago() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const {horaInicio, horaFin, fechaInicio, fechaFinalizacion,} = useAgenda();
    const [servicios, setServicios] = useState([]);
    const [totalPago, setTotalPago] = useState(0);

    const porMientras = [
        {
            id_servicios: 1,
            tituloServicio: 'Fonasa',
            valorServicio: 10000,
            descripcionServicio: 'Atencion General',
            estadoServicio: 1
        },
        {
            id_servicios: 2,
            tituloServicio: 'Isapre',
            valorServicio: 16500,
            descripcionServicio: 'Atencion General',
            estadoServicio: 1
        },
        {
            id_servicios: 3,
            tituloServicio: 'Particular',
            valorServicio: 30000,
            descripcionServicio: 'Atencion General',
            estadoServicio: 1
        },
        {
            id_servicios: 4,
            tituloServicio: 'Pruebas',
            valorServicio: 10,
            descripcionServicio: 'Atencion General',
            estadoServicio: 1
        }
    ]

    useEffect(() => {
        setServicios(porMientras);
    }, []);

    // handleSubmit: se ejecuta al enviar el formulario
    // Envía los datos al backend que crea la preferencia de Mercado Pago

    async function pagarMercadoPago(
        nombrePaciente,
        apellidoPaciente,
        rut,
        telefono,
        email,
        fechaInicio,
        horaInicio,
        fechaFinalizacion,
        horaFin,
        totalPago,
    ) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFin) {
                return toast.error("Debe completar toda la informacion para realizar la reserva")
            }

            if (totalPago <= 0) {
                return toast.error("Debe completar toda la informacion para realizar la reserva")
            }

            let horaFinalizacion = horaFin;

            const res = await fetch(`${API}/pagosMercadoPago/create-order`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombrePaciente,
                    apellidoPaciente,
                    rut,
                    telefono,
                    email,
                    fechaInicio,
                    horaInicio,
                    fechaFinalizacion,
                    horaFinalizacion,
                    estadoReserva: "pendiente pago",
                    totalPago
                }),
                mode: "cors",

            });

            if (!res.ok) {
                return toast.error("No se puede procesar el pago por favor evalue otro medio de pago contactandonos por WhatsApp")
            }

            const data = await res.json();
            console.log("Respuesta create-order:", data);

            if (data) {

                const checkoutUrl = data?.init_point;
                console.log("checkoutUrl:", checkoutUrl);

                if (checkoutUrl) {
                    console.log(checkoutUrl);
                    window.location.href = checkoutUrl;

                } else {
                    return toast.error("No se puede procesar el pago. Problema a nivel del Link de init poiunt")
                }
            } else {
                return toast.error("No se puede procesar el pago. Intenet mas tarde.")

            }
        } catch (err) {
            console.error(err);
            return toast.error("No se puede procesar el pago por favor evalue otro medio de pago contactandonos por WhatsApp")

        }
    }


    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <ToasterClient/>
            <div className="mx-auto max-w-3xl">
                <header className="mb-6">
                    <h1 className="text-2xl font-extrabold text-sky-700">Formulario de pago</h1>
                    <p className="mt-1 text-sm text-slate-500">Completa los datos del paciente y la reserva para
                        procesar el pago.</p>
                </header>

                <form
                    className="rounded-2xl bg-white border border-sky-100 p-6 shadow-sm"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Nombre</label>
                            <ShadcnInput
                                value={nombrePaciente}
                                onChange={(e) => setNombrePaciente(e.target.value)}
                                placeholder="Ej: Ana"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Apellido</label>
                            <ShadcnInput
                                value={apellidoPaciente}
                                onChange={(e) => setApellidoPaciente(e.target.value)}
                                placeholder="Ej: Pérez"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Rut</label>
                            <ShadcnInput
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                placeholder="12.345.678-9"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Correo</label>
                            <ShadcnInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.cl"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Teléfono</label>
                            <ShadcnInput
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="+56 9 1234 5678"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-sky-600 mb-2">Rango fecha
                                Seleccionado</label>


                            <div className="">
                                {
                                    fechaInicio && (
                                        <div className="text-sm text-slate-600">
                                            <span>Fecha Seleccionada :</span> {fechaInicio.toString()}
                                        </div>
                                    )
                                }


                                {horaInicio && (
                                    <div className="text-sm text-slate-600">
                                        <span>Hora inicio :</span> {horaInicio.toString()}
                                    </div>
                                )}


                                {horaFin && (
                                    <div className="text-sm text-slate-600">
                                        <span>Hora Finalizacion :</span> {horaFin.toString()}
                                    </div>
                                )}
                            </div>


                        </div>


                    </div>

                    <div
                        className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">


                        <div className="flex gap-2">
                            <ShadcnButton2
                                nombre={"PAGAR"}
                                funcion={(e) => {
                                    // Evita que el form intente hacer submit (recarga/navegación) y corta el redirect
                                    if (e?.preventDefault) e.preventDefault();
                                    if (e?.stopPropagation) e.stopPropagation();

                                    return pagarMercadoPago(
                                        nombrePaciente,
                                        apellidoPaciente,
                                        rut,
                                        telefono,
                                        email,
                                        fechaInicio,
                                        horaInicio,
                                        fechaFinalizacion,
                                        horaFin,
                                        totalPago
                                    );
                                }}
                            />

                            <Link href={"/AgendaProceso"}>
                                <ShadcnButton2 nombre={"RETROCEDER"}/>
                            </Link>
                        </div>
                    </div>


                    <br/>

                    {/*BAJADA DE FOMULARIO PARA ESCRITORIO*/}
                    <div className="hidden md:block">
                        <div className="flex gap-5 ">

                            <span className="text-lg font-bold mt-1">Seleccione Prevision</span>
                            <Select onValueChange={(value) => setTotalPago(Number(value))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Prevision Salud"/>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        {servicios.map((servicio) => (
                                            <SelectItem
                                                key={servicio.id_servicios}
                                                value={String(servicio.valorServicio)} // <- CLAVE
                                            >
                                                {servicio.tituloServicio}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <div className="mt-2 flex gap-3 ">
                                <span className="font-bold">Valor Consulta : </span>

                                {totalPago && (
                                    <div className="flex gap-5 text-green-700 font-bold">
                                        <span>{formatoCLP.format(totalPago)}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>


                    <div className="block md:hidden">
                        <div className="flex flex-col items-stretch gap-3 ">

                            <span className="text-xs font-bold mt-1">Seleccione Prevision</span>
                            <Select onValueChange={(value) => setTotalPago(Number(value))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Prevision Salud"/>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        {servicios.map((servicio) => (
                                            <SelectItem
                                                key={servicio.id_servicios}
                                                value={String(servicio.valorServicio)} // <- CLAVE
                                            >
                                                {servicio.tituloServicio}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className="mt-2 flex gap-5">
                                <span className="text-xs font-bold mt-1">Valor Consulta : </span>

                                {totalPago && (
                                    <div className="flex gap-5 font-bold text-green-700">
                                        <span>{formatoCLP.format(totalPago)}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>


                </form>

                <br/>

                <div className="text-sm text-slate-500">
                    <span className="font-medium text-sky-600">Importante:</span> Revisa que los datos sean
                    correctos antes de pagar.
                </div>


                {/*BAJADA DE FOMULARIO PARA ESCRITORIO*/}

                <div className="hidden md:block">


                    <div className="flex gap-5 mt-10  ">
                        <Image src={"/MP.png"} alt={"Mercado Pago"} width={300} height={250}/>

                        <div className="flex flex-col gap-3">
                            <div className="w-full max-w-md">
                                <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-sky-700">Pagá con confianza</h3>
                                            <p className="mt-1 text-sm text-slate-500">Transacciones seguras y métodos
                                                aceptados
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Transacción cifrada */}
                                        <div className="flex items-start gap-3">
                                        <span
                                            className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                                                 aria-hidden>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M5 20a7 7 0 0114 0v1H5v-1z"/>
                                            </svg>
                                        </span>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">Transacción cifrada
                                                </div>
                                                <div className="text-xs text-slate-500">Tus datos viajan seguros y
                                                    encriptados
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pago seguro */}
                                        <div className="flex items-start gap-3">
                                        <span
                                            className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" strokeWidth={1.5}
                                                 aria-hidden>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M12 2l3 6 6 .5-4.5 3 1.5 6L12 15l-6 3 1.5-6L3 8.5 9 8 12 2z"/>
                                            </svg>
                                        </span>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">Pago seguro</div>
                                                <div className="text-xs text-slate-500">Garantía de pago y protección
                                                    para
                                                    transacciones
                                                </div>
                                            </div>
                                        </div>

                                        {/* Débito / Crédito */}
                                        <div className="flex items-start gap-3">
                                        <span
                                            className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" strokeWidth={1.5}
                                                 aria-hidden>
                                                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20"/>
                                            </svg>
                                        </span>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">Tarjeta Débito /
                                                    Crédito
                                                </div>
                                                <div className="text-xs text-slate-500">Aceptamos Visa, Mastercard y
                                                    otros
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cualquier tarjeta */}
                                        <div className="flex items-start gap-3">
                                        <span
                                            className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" strokeWidth={1.5}
                                                 aria-hidden>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8"/>
                                            </svg>
                                        </span>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">Aceptamos todas las
                                                    tarjetas
                                                </div>
                                                <div className="text-xs text-slate-500">Paga con la tarjeta que
                                                    prefieras
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
