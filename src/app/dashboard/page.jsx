"use client";
import {Michroma} from "next/font/google";
import Image from "next/image";

const michroma = Michroma({
    weight: "400",
    subsets: ["latin"],
});

export default function DashboardHome() {

    return (
        <di>


            {/*PANTALLAS CELULARES*/}
            <div className="block md:hidden">
                <style jsx>{`
                    @keyframes fadeInUp {
                        0% {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .animate-fadeInUp {
                        animation: fadeInUp 1s ease forwards;
                    }

                    .delay-200 {
                        animation-delay: 0.2s;
                    }

                    @keyframes slowspin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }

                    .animate-slowspin {
                        animation: slowspin 25s linear infinite;
                    }
                `}</style>
                <div
                    className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-white px-4 py-10">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -left-16 w-72 h-72 bg-white  rounded-3xl blur-2xl"></div>
                        <div
                            className="absolute top-1/2 -right-40 w-[420px] h-[420px] bg-white  rounded-full blur-3xl opacity-70"></div>
                        <div
                            className="absolute bottom-[-40px] left-1/3 w-64 h-64 bg-white  rounded-full blur-2xl"></div>

                    </div>
                    <div className=" relative z-10 flex flex-col items-center text-center max-w-2xl">

                        <div className=" -mt-40  ">
                            <h1 className={`${michroma.className} text-4xl md:text-6xl font-extrabold tracking-tight text-sky-700 animate-fadeInUp mt-30`}>
                                M e d i f y
                            </h1>
                            <p className={`${michroma.className}  font-extrabold tracking-tight text-sky-700 animate-fadeInUp`}>Clinica
                                en la Nube</p>


                        </div>
                        <Image src={'/cloud.jpeg'} alt="cloud" height={300} width={300} className="-mt-10"/>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full animate-fadeInUp delay-200">

                        </div>
                    </div>
                </div>
            </div>


            {/*PRINCIPAL EN PANTALLAS DE ESCRITORIO*/}
            <div className="hidden md:block">
                <style jsx>{`
                    @keyframes fadeInUp {
                        0% {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .animate-fadeInUp {
                        animation: fadeInUp 1s ease forwards;
                    }

                    .delay-200 {
                        animation-delay: 0.2s;
                    }

                    @keyframes slowspin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }

                    .animate-slowspin {
                        animation: slowspin 25s linear infinite;
                    }
                `}</style>
                <div
                    className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-white px-4 py-10">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -left-16 w-72 h-72 bg-white  rounded-3xl blur-2xl"></div>
                        <div
                            className="absolute top-1/2 -right-40 w-[420px] h-[420px] bg-white  rounded-full blur-3xl opacity-70"></div>
                        <div
                            className="absolute bottom-[-40px] left-1/3 w-64 h-64 bg-white  rounded-full blur-2xl"></div>

                    </div>
                    <div className=" relative z-10 flex flex-col items-center text-center max-w-2xl">

                        <div className="flex -mt-20  ">
                            <h1 className={`${michroma.className} text-4xl md:text-6xl font-extrabold tracking-tight text-sky-700 animate-fadeInUp mt-30`}>
                                M e d i f y
                            </h1>

                            <Image src={'/cloud.jpeg'} alt="cloud" height={300} width={300}/>

                        </div>
                        <h2 className={`${michroma.className} mr-80 -mt-25 text-base md:text-xl font-medium text-sky-700 opacity-90 animate-fadeInUp delay-200`}>
                            Clinica en la Nube
                        </h2>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full animate-fadeInUp delay-200">
                            <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm text-left">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-500">Agenda
                                    médica</p>
                                <p className="mt-1 text-sm text-gray-800">Organiza horarios, profesionales y box
                                    clínicos en
                                    tiempo real.</p>
                            </div>
                            <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm text-left">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-500">Historia
                                    clínica</p>
                                <p className="mt-1 text-sm text-gray-800">Centraliza fichas, evoluciones y documentos de
                                    tus
                                    pacientes.</p>
                            </div>
                            <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm text-left">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-500">Reportes y
                                    métricas</p>
                                <p className="mt-1 text-sm text-gray-800">Visualiza indicadores clave de tu centro
                                    médico en
                                    segundos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </di>

    );
}