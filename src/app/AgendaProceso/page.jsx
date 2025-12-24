"use client";
import {useMemo, useState, useEffect, useRef} from "react";
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
    // Ref para evitar que resultados asíncronos antiguos sobrescriban acciones manuales recientes
    const lastManualUpdateRef = useRef(0);

    const {
        horaInicio, setHoraInicio,
        setHoraFin,
        setFechaInicio,
        setFechaFinalizacion
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

    // Genera solo los bloques de atención (40 min) desde 09:00 hasta 21:00.
    // Los inicios van separados por 50 minutos (40 atención + 10 descanso), pero los descansos no se muestran.
    const attentionSlots = useMemo(() => {
        const slots = [];
        const startMinutes = 9 * 60; // 09:00
        const endMinutes = 21 * 60; // 21:00
        let cursor = startMinutes;

        const minutesToHHMM = (min) => {
            const hh = Math.floor(min / 60);
            const mm = min % 60;
            return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
        };

        while (cursor + 40 <= endMinutes) {
            const attStart = cursor;
            const attEnd = cursor + 40;
            slots.push({start: minutesToHHMM(attStart), end: minutesToHHMM(attEnd)});
            // avanzar 40 + 10 minutos (=50) para el siguiente inicio
            cursor = attEnd + 10;
        }

        return slots;
    }, []);

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
            const horaFinAuto = addMinutesToHHMM(horaInicio, 40);
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
        const horaFinAuto = addMinutesToHHMM(hora, 40);

        setHoraInicio(hora);
        setHoraFin(horaFinAuto);

        // Guardamos las strings en el contexto: fechaYYYY-MM-DD y hora HH:MM
        if (fechaSeleccionada) {
            const fechaYMD = formatDateToYMD(fechaSeleccionada);
            setFechaInicio(fechaYMD);
            setFechaFinalizacion(fechaYMD);

            // Marcar acción manual para que cualquier checkBlocked en curso no sobreescriba cambios
            lastManualUpdateRef.current = Date.now();

            // Revalidar slots adyacentes para evitar que la selección haga que los vecinos aparezcan bloqueados
            (async () => {
                try {
                    const idx = attentionSlots.findIndex(s => s.start === hora);
                    if (idx === -1) return;

                    const neighbors = [];
                    if (idx - 1 >= 0) neighbors.push(attentionSlots[idx - 1]);
                    if (idx + 1 < attentionSlots.length) neighbors.push(attentionSlots[idx + 1]);

                    for (const n of neighbors) {
                        const res = await validarFechaDisponible(formatDateToYMD(fechaSeleccionada), n.start, formatDateToYMD(fechaSeleccionada), n.end, false);
                        // res is object {available, ...}
                        if (res && res.available) {
                            setBlockedHours(prev => {
                                if (!prev.has(n.start)) return prev;
                                const copy = new Set(prev);
                                copy.delete(n.start);
                                // actualizar resumen también
                                setCheckSummary({blocked: copy.size, total: attentionSlots.length});
                                return copy;
                            });
                        }
                    }
                } catch (err) {
                    console.error('Error revalidando vecinos:', err);
                }
            })();
        }
    };

    const dias = generarDiasMes();
    const API = process.env.NEXT_PUBLIC_API_URL;

    const [blockedHours, setBlockedHours] = useState(new Set());
    const [checkingBlocked, setCheckingBlocked] = useState(false);
    const [checkSummary, setCheckSummary] = useState({blocked: 0, total: 0});

    // Comprueba si un slot está disponible. Devuelve true si está disponible, false si está ocupado.
    // showToast: opcional, si true mostrará mensajes de error al usuario.
    async function validarFechaDisponible(fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, showToast = false) {
        try {
            // validación mínima de parámetros
            if (!fechaInicio || !fechaFinalizacion || !horaInicio || !horaFinalizacion) {
                if (showToast) toast.error('Debe seleccionar fecha y hora para validar disponibilidad');
                return false;
            }

            const res = await fetch(`${API}/reservaPacientes/validar`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion})
            });

            let respuestaBackend;
            try {
                respuestaBackend = await res.json();
            } catch (err) {
                respuestaBackend = null;
            }

            const status = res.status;

            // Logging para depuración
            console.debug('validarFechaDisponible ->', {
                fechaInicio,
                horaInicio,
                fechaFinalizacion,
                horaFinalizacion,
                status,
                body: respuestaBackend
            });

            // Determinar disponibilidad
            if (respuestaBackend && respuestaBackend.message === true) return {
                available: true,
                status,
                body: respuestaBackend,
                error: false
            };
            if (respuestaBackend && respuestaBackend.message === false) return {
                available: false,
                status,
                body: respuestaBackend,
                error: false
            };

            if (res.ok) return {available: true, status, body: respuestaBackend, error: false};

            // status no OK y sin body
            if (!res.ok) {
                if (showToast) toast.error('No hay respuesta válida del servidor');
                return {available: false, status, body: respuestaBackend, error: false};
            }
        } catch (error) {
            if (showToast) toast.error('Error de red al validar disponibilidad');
            console.error('validarFechaDisponible error:', error);
            return {available: true, status: 0, body: null, error: true};
        }
    }

    // Cuando el usuario selecciona una fecha, comprobamos en paralelo los slots y guardamos los bloqueados
    useEffect(() => {
        let mounted = true;

        async function checkBlocked() {
            if (!fechaSeleccionada) {
                if (mounted) setBlockedHours(new Set());
                return;
            }

            setCheckingBlocked(true);
            const fechaYMD = formatDateToYMD(fechaSeleccionada);

            try {
                // paralelizamos las comprobaciones por batches para limitar concurrencia
                const attentionEntries = attentionSlots; // ahora es la lista de atenciones (sin descansos)
                const limit = 6; // máximo requests simultáneos
                const checks = [];

                for (let i = 0; i < attentionEntries.length; i += limit) {
                    const batch = attentionEntries.slice(i, i + limit);
                    const batchResults = await Promise.all(batch.map(async (entry) => {
                        const result = await validarFechaDisponible(fechaYMD, entry.start, fechaYMD, entry.end, false);
                        return {h: entry.start, ...result};
                    }));

                    checks.push(...batchResults);
                }

                if (!mounted) return;

                const blocked = new Set(checks.filter(c => c.available === false).map(c => c.h));
                // Si hubo una actualización manual después de que este check comenzó, NO aplicamos su resultado
                if (lastManualUpdateRef.current > checkStart) {
                    console.debug('checkBlocked result skipped because of manual update', {
                        skippedAt: lastManualUpdateRef.current,
                        checkStart
                    });
                } else {
                    setBlockedHours(blocked);
                    // actualizar resumen para debug en UI
                    setCheckSummary({blocked: blocked.size, total: attentionEntries.length});
                }
                console.debug('checkBlocked ->', {total: attentionEntries.length, blocked: blocked.size, raw: checks});

                // heurística: si todas las respuestas indican no disponible, probablemente hay un problema en el backend
                if (blocked.size === attentionEntries.length) {
                    toast.error('Todas las horas resultaron ocupadas al verificar — revisa el backend o intenta recargar');
                }

                // si la hora actualmente seleccionada quedó bloqueada, limpiarla
                if (horaInicio && blocked.has(horaInicio)) {
                    setHoraInicio("");
                    setHoraFin("");
                    setFechaInicio("");
                    setFechaFinalizacion("");
                    toast.error('La hora seleccionada ya no está disponible');
                }
            } catch (e) {
                // Si hay fallo general, vaciamos bloqueos y no bloqueamos nada por seguridad
                if (mounted) setBlockedHours(new Set());
            } finally {
                if (mounted) setCheckingBlocked(false);
            }
        }

        // startTimestamp para comparar con lastManualUpdateRef
        const checkStart = Date.now();
        // Hacemos disponible el timestamp a la función mediante closure
        checkBlocked.checkStart = checkStart;
        checkBlocked();

        return () => {
            mounted = false;
        }
    }, [fechaSeleccionada, attentionSlots]);

    // Evitar llamadas al backend en cada render; useEffect gestiona comprobaciones.

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
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, idx) => (
                            <strong key={`weekday-${idx}`}
                                    className="text-center text-xs font-semibold text-slate-400">{d}</strong>
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
                                <h3 className="text-sm font-semibold text-slate-800">Agenda (09:00–21:00)</h3>
                                <div className="flex items-center gap-3">
                                    <p className="text-xs text-slate-500">Patrón: 40 min atención + 10 min descanso
                                        (interno)</p>
                                    {checkingBlocked && (
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <svg className="w-3 h-3 animate-spin text-sky-500"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            <span>Comprobando disponibilidad...</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 space-y-2 max-h-96 overflow-y-auto pr-1">
                                {attentionSlots.map((entry, idx) => {
                                    const isBlocked = blockedHours.has(entry.start);
                                    const selected = horaInicio === entry.start;
                                    // displayEnd es el inicio del siguiente slot (visual continúo). Para el último, usamos start + 50min.
                                    const displayEnd = (idx + 1 < attentionSlots.length) ? attentionSlots[idx + 1].start : addMinutesToHHMM(entry.start, 50);

                                    return (
                                        <div key={entry.start}
                                             className={"flex items-center justify-between rounded-md border p-3 " + (isBlocked ? 'bg-red-50 border-red-100 text-red-700' : 'bg-white border-sky-50')}>
                                            <div>
                                                <div
                                                    className={"text-sm font-medium " + (isBlocked ? 'text-red-700' : 'text-slate-800')}>Atención
                                                </div>
                                                <div
                                                    className={"text-xs " + (isBlocked ? 'text-red-500' : 'text-slate-500')}>{entry.start} – {displayEnd}</div>
                                                <div className="text-[11px] text-slate-400">(Atención: 40 min, +10 min
                                                    receso interno)
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {isBlocked ? (
                                                    <span
                                                        className="inline-flex items-center gap-2 text-sm text-red-600">
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg"><path
                                                            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                                                            fill="#FEE2E2"/><path
                                                            d="M8.53 8.53l6.94 6.94M15.47 8.53l-6.94 6.94"
                                                            stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"
                                                            strokeLinejoin="round"/></svg>
                                                        No disponible
                                                    </span>
                                                ) : (
                                                    <button onClick={() => seleccionarInicio(entry.start)}
                                                            className={"px-3 py-1 rounded-md font-semibold " + (selected ? 'bg-sky-600 text-white' : 'bg-white border border-sky-200 text-sky-600 hover:bg-sky-50')}>
                                                        {selected ? 'Seleccionada' : 'Seleccionar'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Resumen de verificación (debug) */}
                            <div className="mt-4 text-center text-xs text-slate-500">
                                <span>Bloqueados: {checkSummary.blocked} / {checkSummary.total} slots</span>
                            </div>
                        </div>
                    )}
                </div>
                <br/>

                <div>
                    <Link href={"/formularioPago"}>
                        <ShadcnButton2 nombre={"SIGUIENTE"}/>
                    </Link>
                </div>

                <footer className="mt-8 text-center text-xs text-slate-500">
                    <p>
                        Medify · Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </div>
    );
}
