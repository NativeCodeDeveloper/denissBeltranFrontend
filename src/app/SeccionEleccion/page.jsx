import Link from "next/link";
import Image from "next/image";

export default function SeccionEleccion(){
    return(
        <div className="w-full py-8 sm:py-12 lg:py-16 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* CONTENIDO TEXTO */}
                    <div className="order-2 lg:order-1">
                        {/* TÍTULO */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-rose-600 text-center lg:text-left mb-6 lg:mb-8">
                            ¿Por qué elegirme?
                        </h1>

                        {/* LISTA DE BENEFICIOS */}
                        <ul className="space-y-4 sm:space-y-6 mb-8 lg:mb-12">
                            <li className="text-base sm:text-lg lg:text-xl xl:text-2xl text-justify flex items-start gap-3">
                                <span className="text-rose-600 font-bold text-xl">✔</span>
                                <span>Comunicación empática y sin juicios</span>
                            </li>
                            <li className="text-base sm:text-lg lg:text-xl xl:text-2xl text-justify flex items-start gap-3">
                                <span className="text-rose-600 font-bold text-xl">✔</span>
                                <span>Confidencialidad profesional absoluta</span>
                            </li>
                            <li className="text-base sm:text-lg lg:text-xl xl:text-2xl text-justify flex items-start gap-3">
                                <span className="text-rose-600 font-bold text-xl">✔</span>
                                <span>Terapias basadas en ciencia y evidencia</span>
                            </li>
                            <li className="text-base sm:text-lg lg:text-xl xl:text-2xl text-justify flex items-start gap-3">
                                <span className="text-rose-600 font-bold text-xl">✔</span>
                                <span>Especial atención a mujeres con desafíos emocionales</span>
                            </li>
                            <li className="text-base sm:text-lg lg:text-xl xl:text-2xl text-justify flex items-start gap-3">
                                <span className="text-rose-600 font-bold text-xl">✔</span>
                                <span>Atención online, cómoda y accesible</span>
                            </li>
                        </ul>

                        {/* BOTÓN CTA */}
                        <div className="flex justify-center lg:justify-start">
                            <Link href="/AgendaProceso">
                                <button className="
                                    px-6 sm:px-8 lg:px-10 py-3 sm:py-4
                                    rounded-xl sm:rounded-2xl
                                    border-2 border-rose-600
                                    text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white
                                    bg-rose-400 hover:bg-rose-600
                                    transform transition-all duration-300 ease-in-out
                                    hover:scale-105 hover:shadow-lg
                                    active:scale-95
                                    w-full sm:w-auto
                                    max-w-md
                                ">
                                    Agendar mi Primera Sesión
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* IMAGEN */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <Image
                            src="/seccionEleccion.png"
                            alt="Elección de terapia"
                            height={500}
                            width={500}
                            className="rounded-2xl w-full max-w-md lg:max-w-full h-auto shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}