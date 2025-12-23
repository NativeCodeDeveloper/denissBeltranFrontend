"use client";
import {useMemo, useState} from "react";
import {Michroma} from "next/font/google";
import {useAgenda} from "@/ContextosApp/AgendaContext";
import Link from "next/link";
import ShadcnButton2 from "@/componentes/shadcnButton2";
import {toast} from "react-hot-toast";

const michroma = Michroma({
    subsets: ["latin"],
    weight: "400",
});

function formatDateToYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export default function CalendarioMensualHoras() {
    const [mesActual, setMesActual] = useState(new Date());
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const {
        horaInicio, setHoraInicio,
        horaFin, setHoraFin,
        fechaInicio, setFechaInicio,
        fechaFinalizacion, setFechaFinalizacion
    } = useAgenda();


    /* ---------- utilidades ---------- */
    const generarDiasMes = () => {
        const year = mesActual.getFullYear();
        const month = mesActual.getMonth();
        const firstDay = new Date(year, month, 1).getDay(); // 0=domingo
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dias = [];
        for (let i = 0; i < firstDay; i++) dias.push(null);
        for (let d = 1; d <= daysInMonth; d++) dias.push(new Date(year, month, d));
        return dias;
    };

    const horas = useMemo(() => {
        // Horas disponibles desde 09:00 hasta 19:00 (rangos de 60 min, inicio cada 15 min)
        const arr = [];
        for (let h = 9; h <= 18; h++) { // 18:45 + 60 = 19:45 (tope visual 19)
            for (let m = 0; m < 60; m += 15) {
                arr.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
            }
        }
        return arr;
    }, []);

    const buildDateTime = (fecha, hora) => {
        const [h, m] = hora.split(":").map(Number);
        const d = new Date(fecha);
        d.setHours(h, m, 0, 0);
        return d;
    };

    const addMinutesToHHMM = (hhmm, minutesToAdd) => {
        const [hh, mm] = hhmm.split(":").map(Number);
        const total = hh * 60 + mm + minutesToAdd;
        const newH = Math.floor(total / 60);
        const newM = total % 60;
        return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
    };

    /* ---------- handlers ---------- */
    const seleccionarFecha = (fecha) => {
        setFechaSeleccionada(fecha);

        const fechaYMD = formatDateToYMD(fecha);

        // Si ya hay hora seleccionada, mantenla y recalcula las cadenas en el contexto
        if (horaInicio) {
            const horaFinAuto = addMinutesToHHMM(horaInicio, 60);
            setHoraFin(horaFinAuto);
            setFechaInicio(fechaYMD);
            setFechaFinalizacion(fechaYMD);
            return;
        }

        // Si aún no hay hora, solo dejamos la fecha lista (fechaInicio vacía hasta elegir hora)
        setHoraFin("");
        setFechaInicio("");
        setFechaFinalizacion("");
    };

    const seleccionarInicio = (hora) => {
        const horaFinAuto = addMinutesToHHMM(hora, 60);

        setHoraInicio(hora);
        setHoraFin(horaFinAuto);

        // Guardamos las strings en el contexto: fechaYYYY-MM-DD y hora HH:MM
        if (fechaSeleccionada) {
            const fechaYMD = formatDateToYMD(fechaSeleccionada);
            setFechaInicio(fechaYMD);
            setFechaFinalizacion(fechaYMD);
        }
    };

    const dias = generarDiasMes();
    const API = process.env.NEXT_PUBLIC_API_URL;


    async function validarFechaDisponible(fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion) {
        try {
            if (!fechaInicio || !fechaFinalizacion || !horaInicio || !fechaFinalizacion || !horaFinalizacion) {
                return toast.error('Debe seleccionar una fecha para validar disponibilidad')
            }

            const res = await fetch(`${API}/reservaPacientes/validar`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion})
            });

            if (!res.ok) {
                return toast.error('No hay respuesta del servidor')
            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.message === true) {

                } else {

                }

            }
        } catch (error) {
            throw error;
        }
    }

    /* ---------- UI ---------- */
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl">
                <header className="mb-6 flex flex-col items-center gap-2 text-center">
                    <div
                        className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-slate-600">
                        Agenda · Telemedicina
                    </div>

                    <h1
                        className={`${michroma.className} text-3xl sm:text-4xl font-black tracking-widest text-slate-900`}
                    >
                        <span className="antialiased text-slate-900">MEDIFY</span>
                        <span
                            className="relative mt-1 block h-1 w-40 max-w-full rounded-full bg-gradient-to-r from-sky-300 via-sky-200 to-transparent"
                        />
                    </h1>

                    <p className="max-w-md text-sm leading-6 text-slate-500">
                        Reserva tu hora de telemedicina en segundos. Selecciona fecha y un bloque horario disponible.
                    </p>
                </header>

                <div className="rounded-2xl border border-sky-100 bg-white p-3 shadow-sm text-slate-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-800">Agenda mensual</h2>
                        <span className="text-[12px] text-slate-500">Selecciona un día</span>
                    </div>
                    <div className="mt-3 h-px w-full bg-sky-100"/>

                    {/* Navegación mes */}
                    <div className="mt-3 flex items-center justify-between">
                        <button
                            className="rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:bg-sky-50 active:scale-[0.98]"
                            onClick={() => {
                                setMesActual(new Date(mesActual.setMonth(mesActual.getMonth() - 1)));
                                setFechaSeleccionada(null);
                                setHoraInicio("");
                                setHoraFin("");
                                setFechaInicio("");
                                setFechaFinalizacion("");
                            }}
                        >
                            ←
                        </button>
                        <strong className="capitalize text-sm font-semibold text-slate-800">
                            {mesActual.toLocaleString("es-CL", {month: "long", year: "numeric"})}
                        </strong>
                        <button
                            className="rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:bg-sky-50 active:scale-[0.98]"
                            onClick={() => {
                                setMesActual(new Date(mesActual.setMonth(mesActual.getMonth() + 1)));
                                setFechaSeleccionada(null);
                                setHoraInicio("");
                                setHoraFin("");
                                setFechaInicio("");
                                setFechaFinalizacion("");
                            }}
                        >
                            →
                        </button>
                    </div>

                    {/* Calendario */}
                    <div className="mt-4 grid grid-cols-7 gap-2">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d) => (
                            <strong key={d} className="text-center text-xs font-semibold text-slate-400">{d}</strong>
                        ))}

                        {dias.map((dia, i) =>
                            dia ? (
                                <button
                                    key={i}
                                    onClick={() => seleccionarFecha(dia)}
                                    className={
                                        "h-10 flex items-center justify-center rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-1 " +
                                        (fechaSeleccionada?.toDateString() === dia.toDateString()
                                            ? "border-sky-300 bg-sky-100 text-slate-800"
                                            : "border-sky-200 bg-white text-slate-600 hover:bg-sky-50 hover:border-sky-300")
                                    }
                                >
                                    {dia.getDate()}
                                </button>
                            ) : (
                                <div key={i}/>
                            )
                        )}
                    </div>

                    {/* Horarios */}
                    {fechaSeleccionada && (
                        <div className="mt-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-800">Horas disponibles</h3>
                                <p className="text-xs text-slate-500">Bloques de 60 min · cada 15 min · 09:00–19:00</p>
                            </div>

                            <div className="mt-3 grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                                {horas.map((h) => {
                                    const fin = addMinutesToHHMM(h, 60);
                                    const selected = horaInicio === h;

                                    return (
                                        <button
                                            key={h}
                                            onClick={() => seleccionarInicio(h)}
                                            className={
                                                "group w-full rounded-md px-4 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-1 " +
                                                (selected
                                                    ? "border-sky-300 bg-sky-100 text-slate-800"
                                                    : "border-sky-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50")
                                            }
                                        >
                                            <span className="tabular-nums">{h} – {fin}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Resultado */}
                    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-3 text-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-800">Resultado</div>
                            <div className="text-xs text-slate-500">Resumen</div>
                        </div>

                        <div className="mt-3 grid gap-2 rounded-xl border border-sky-100 bg-white p-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-mono text-sky-500">Rango</span>
                                <span
                                    className="font-semibold tabular-nums">{horaInicio && horaFin ? `${horaInicio} – ${horaFin}` : "-"}</span>
                            </div>

                            <div className="flex items-center justify-between text-[13px]">
                                <span className="font-mono text-sky-500">fechaInicio</span>
                                <span
                                    className="font-mono tabular-nums text-slate-700">{fechaInicio || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="font-mono text-sky-500">fechaFinalizacion</span>
                                <span
                                    className="font-mono tabular-nums text-slate-700">{fechaFinalizacion || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center mt-20">
                <Link href={"/formularioPago"}>
                    <ShadcnButton2 nombre={"SIGUIENTE"}></ShadcnButton2>
                </Link>
            </div>
        </div>
    );
}