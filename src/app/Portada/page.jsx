// src/app/layout.js (o layout.tsx)

import {Lexend, Playfair_Display} from "next/font/google";

const lexend = Lexend({
    weight: ["300", "400", "500", "600"],
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

import {Sour_Gummy} from "next/font/google";

const sourGummy = Sour_Gummy({
    subsets: ["latin"], // debes elegir los subsets
    weight: ["400", "500", "700"], // los pesos que quieras usar
});


import NavBar from "@/componentes/NavBar";
import Link from "next/link";

// Base de la API configurable por entorno (dev/prod)
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function cargarTitulos() {
    try {
        const res = await fetch(`${API}/titulo`, {
            cache: 'no-store',
            // Agregar timeout y mejor manejo de errores
            signal: AbortSignal.timeout(5000)
        });

        if (!res.ok) {
            console.warn('No se pudieron cargar los títulos:', res.status);
            return [];
        }

        return await res.json();
    } catch (error) {
        console.warn('Error al cargar títulos (puede ser normal durante build):', error.message);
        // Retornar títulos por defecto para que el build funcione
        return [
            {id_titulo: 1, titulo: 'Bienvenido a tu espacio de bienestar'},
            {id_titulo: 2, titulo: 'Psicología clínica con enfoque humanista'}
        ];
    }
}

export default async function Portada() {
    const titulos = await cargarTitulos();

    const tituloPrincipal = titulos.find((item) => item.id_titulo === 1);
    const subtitulo = titulos.find((item) => item.id_titulo === 2);

    return (
        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
            <NavBar/>

            {/* Hero Section */}
            <div className="relative min-h-screen overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-20 left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl animate-pulse"></div>
                    <div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-200/20 rounded-full blur-2xl"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
                    <div className="max-w-5xl mx-auto">

                        {/* Centered Content */}
                        <div className="text-center space-y-8 lg:space-y-10">
                            {/* Badge */}
                            <div
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-200/50">
                                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
                                <span className={`${lexend.className} text-sm font-medium text-rose-700`}>
                                    Atención Psicológica Profesional
                                </span>
                            </div>

                            {/* Main Title */}
                            {tituloPrincipal && (
                                <h1 className={`${playfair.className} text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight px-4`}>
                                    <span
                                        className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                                        {tituloPrincipal.titulo}
                                    </span>
                                </h1>
                            )}

                            {/* Subtitle */}
                            {subtitulo && (
                                <p className={`${lexend.className} text-xl sm:text-2xl lg:text-3xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed px-4`}>
                                    {subtitulo.titulo}
                                </p>
                            )}

                            {/* Special Offer Banner */}
                            <div className="max-w-2xl mx-auto">
                                <div
                                    className="bg-gradient-to-r from-rose-100 via-pink-100 to-purple-100 rounded-3xl p-6 shadow-lg border-2 border-rose-200/50 backdrop-blur-sm">
                                    <p className={`${sourGummy.className} text-lg sm:text-xl text-rose-700 font-medium`}>
                                        ✨ Regálate este momento para ti… primera sesión con precio especial
                                    </p>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                                <Link href={"/AgendaProceso"} className="w-full sm:w-auto">
                                    <button
                                        className="w-full sm:w-auto group relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-rose-500/50 hover:scale-105">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <span className={lexend.className}>Agendar mi Sesión</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                            </svg>
                                        </span>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                </Link>
                                <Link href={"/Precios"} className="w-full sm:w-auto">
                                    <button
                                        className="w-full sm:w-auto rounded-2xl border-2 border-rose-300 bg-white/90 backdrop-blur-sm px-10 py-5 text-lg font-semibold text-rose-600 shadow-xl transition-all duration-300 hover:bg-rose-50 hover:border-rose-400 hover:shadow-2xl hover:scale-105">
                                        <span className={lexend.className}>Ver Precios</span>
                                    </button>
                                </Link>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
                                <div
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div
                                        className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <h3 className={`${lexend.className} text-lg font-semibold text-gray-800 mb-2`}>
                                        Atención Personalizada
                                    </h3>
                                    <p className={`${lexend.className} text-sm text-gray-600`}>
                                        Enfoque individual adaptado a tus necesidades
                                    </p>
                                </div>

                                <div
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div
                                        className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <h3 className={`${lexend.className} text-lg font-semibold text-gray-800 mb-2`}>
                                        Horarios Flexibles
                                    </h3>
                                    <p className={`${lexend.className} text-sm text-gray-600`}>
                                        Agenda en el momento que mejor te acomode
                                    </p>
                                </div>

                                <div
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div
                                        className="w-14 h-14 bg-gradient-to-br from-purple-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                        </svg>
                                    </div>
                                    <h3 className={`${lexend.className} text-lg font-semibold text-gray-800 mb-2`}>
                                        Sesiones Online
                                    </h3>
                                    <p className={`${lexend.className} text-sm text-gray-600`}>
                                        Desde la comodidad de tu hogar
                                    </p>
                                </div>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm">
                                <div
                                    className="flex items-center gap-2.5 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-full border border-yellow-200/50">
                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                    <span className={`${lexend.className} font-medium text-gray-700`}>Profesional Certificada</span>
                                </div>
                                <div
                                    className="flex items-center gap-2.5 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-full border border-green-200/50">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                    <span className={`${lexend.className} font-medium text-gray-700`}>Confidencialidad Garantizada</span>
                                </div>
                                <div
                                    className="flex items-center gap-2.5 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-full border border-rose-200/50">
                                    <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                    <span className={`${lexend.className} font-medium text-gray-700`}>+100 Pacientes Atendidos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
