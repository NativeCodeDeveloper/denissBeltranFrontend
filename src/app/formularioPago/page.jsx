"use client"
import {useState} from "react";
import ShadcnInput from "@/componentes/shadcnInput";
import ShadcnButton from "@/componentes/shadcnButton";
import ShadcnButton2 from "@/componentes/shadcnButton2";
import {useAgenda} from "@/ContextosApp/AgendaContext";
import ToasterClient from "@/componentes/ToasterClient";
import {toast} from "react-hot-toast";

export default function FormularioPago() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");

    const {horaInicio, horaFin, fechaInicio, fechaFinalizacion,} = useAgenda();


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
    ) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFin) {
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
                    estadoReserva: "pendiente pago"
                })

            });

            if (!res.ok) {
                return toast.error("No se puede procesar el pago por favor evalue otro medio de pago contactandonos por WhatsApp")
            }

            const data = await res.json();
            console.log("Respuesta create-order:", data);

            if (data) {

                const checkoutUrl = data?.sandbox_init_point || data?.init_point;
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
                        <div className="text-sm text-slate-500">
                            <span className="font-medium text-sky-600">Importante:</span> Revisa que los datos sean
                            correctos antes de pagar.
                        </div>

                        <div className="flex gap-2">
                            <ShadcnButton2
                                nombre={"ir a Pagar"}
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
                                        horaFin
                                    );
                                }}
                            />

                            <ShadcnButton2 nombre={"Retroceder"} funcion={(e) => {
                                if (e?.preventDefault) e.preventDefault();
                            }}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
