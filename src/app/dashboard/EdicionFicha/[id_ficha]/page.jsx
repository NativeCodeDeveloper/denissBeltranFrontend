"use client"

import {ShadcnSelect} from "@/componentes/shadcnSelect";
import {Textarea} from "@/components/ui/textarea";
import {useState, useEffect} from "react";
import {useParams} from "next/navigation";
import ToasterClient from "@/componentes/ToasterClient";
import toast from "react-hot-toast";
import {ShadcnButton} from "@/componentes/shadcnButton";
import {ShadcnInput} from "@/componentes/shadcnInput";


export default function EdicionFichaClinica() {
    const {id_ficha} = useParams();
    const [dataFicha, setdataFicha] = useState([]);
    const [tipoAtencion, settipoAtencion] = useState("");
    const [anotacionConsulta, setanotacionConsulta] = useState("");

    const API = process.env.NEXT_PUBLIC_API_URL;

    async function actualizarFicha(tipoAtencion, anotacionConsulta, id_ficha) {
        try {

            if (!tipoAtencion || !anotacionConsulta || !id_ficha) {
                return toast.error('Debe llenar todos los campos para actualizar la ficha');
            }


            const res = await fetch(`${API}/ficha/editarFichaPaciente`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({tipoAtencion, anotacionConsulta, id_ficha}),
                mode: "cors",
                cache: "no-cache"
            });

            if (!res.ok) {
                return toast.error("Ha ocurrido un error en la respuesta del servidor, Contacte a soporte");
            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend.message === true) {
                    setanotacionConsulta("");
                    settipoAtencion("");
                    await seleccionarFichaEspecifica(id_ficha)
                    return toast.success("Ficha Clinica Actualizada!");
                } else {

                    return toast.error('No ha sido posible actualizar la ficha clinica!')
                }
            }

        } catch (error) {
            return toast.error("Ha ocurrido un error, Contacte a soporte");
        }
    }


    async function seleccionarFichaEspecifica(id_ficha) {
        try {
            const res = await fetch(`${API}/ficha/seleccionarFichaID`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_ficha}),
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("No es posible ejecutar la consulta desde la base de datos cotacte a soporte");
            } else {

                const dataFichasClinicas = await res.json();
                if (Array.isArray(dataFichasClinicas)) {
                    setdataFicha(dataFichasClinicas);

                } else {
                    return toast.error("No se encuentras fichas clinicas disponibles con el id seleccionado");
                }
            }

        } catch (err) {
            return toast.error("Ha ocurrido un error, Contacte a soporte");

        }
    }

    useEffect(() => {
        seleccionarFichaEspecifica(id_ficha)
    }, [])


    return (
        <div>
            <ToasterClient/>


            {/*PANTALLAS CELULARES*/}
            <div className="block md:hidden max-w-5xl mx-auto px-4 py-10">

                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-sky-100">
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent mb-6">
                        Edición Ficha
                    </h1>

                    {dataFicha.map((ficha) => (

                        <div className="space-y-4">
                            <div key={ficha.id_ficha}>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sky-50 p-4 rounded-xl border border-sky-100">
                                    <h1>
                                        <span className="text-xs text-sky-800  font-bold ">ID Ficha  : </span>
                                        <span className="text-xs text-sky-800  font-bold ">{ficha.id_ficha}</span>
                                    </h1>


                                    <h1 className="-mt-5">
                                        <span className="text-xs text-sky-800  font-bold ">Tipo : </span>
                                        <span
                                            className="text-xs text-sky-800  font-bold ">{ficha.tipoAtencion} </span>

                                    </h1>
                                </div>

                                <br/>
                                <div>
                                    <h1 className="text-base text-sky-800  font-bold ">Anotacion Actual: </h1>
                                    <p className="whitespace-pre-line text-xs font-sans text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-200">
                                        {ficha.anotacionConsulta}
                                    </p>
                                </div>


                            </div>
                        </div>
                    ))}


                </div>

                <br/> <br/> <br/>


                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent mb-6">Ingrese
                    Informacion</h1>

                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-sky-100">
                    <div>

                        <div>
                            <h1 className="text-base font-bold text-sky-800">Ingrese el tipo de atencion: </h1>
                            <div className="mt-2">
                                <ShadcnInput
                                    value={tipoAtencion}
                                    onChange={e => settipoAtencion(e.target.value)}
                                />
                            </div>
                        </div>

                        <br/>

                        <h1 className="font-bold text-sky-800">Ingrese los nuevos datos </h1>
                        <Textarea
                            className="mt-2 min-h-[140px] resize-none"
                            value={anotacionConsulta}
                            onChange={(e) => setanotacionConsulta(e.target.value)}
                        ></Textarea>
                        <br/>

                        <div className="pt-6 flex justify-end">
                            <ShadcnButton
                                funcion={() => actualizarFicha(tipoAtencion, anotacionConsulta, id_ficha)}
                                nombre={"Actualizar"}/>
                        </div>
                    </div>
                </div>

            </div>


            {/*PANTALLAS ESCRITORIO*/}
            <div className="hidden md:block max-w-5xl mx-auto px-4 py-10">

                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-sky-100">
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent mb-6">
                        Edicion de Ficha Clínica
                    </h1>

                    {dataFicha.map((ficha) => (

                        <div className="space-y-4">
                            <div key={ficha.id_ficha}>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sky-50 p-4 rounded-xl border border-sky-100">
                                    <h1>
                                        <span className="text-base text-sky-800  font-bold ">ID Ficha Clinica : </span>
                                        <span className="text-base text-sky-800  font-bold ">{ficha.id_ficha}</span>
                                    </h1>


                                    <h1>
                                        <span className="text-base text-sky-800  font-bold ">Tipo de Atencion : </span>
                                        <span
                                            className="text-base text-sky-800  font-bold ">{ficha.tipoAtencion} </span>

                                    </h1>
                                </div>

                                <br/>
                                <div>
                                    <h1 className="text-base text-sky-800  font-bold ">Anotacion Actual: </h1>
                                    <p className="font-sans text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-200">
                                        {ficha.anotacionConsulta}
                                    </p>
                                </div>


                            </div>
                        </div>
                    ))}


                </div>

                <br/> <br/> <br/>


                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent mb-6">Ingrese
                    Informacion a Actualziar</h1>

                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-sky-100">
                    <div>

                        <div>
                            <h1 className="font-bold text-sky-800">Ingrese el tipo de atencion: </h1>
                            <div className="mt-2">
                                <ShadcnInput
                                    value={tipoAtencion}
                                    onChange={e => settipoAtencion(e.target.value)}
                                />
                            </div>
                        </div>

                        <br/>

                        <h1 className="font-bold text-sky-800">Ingrese los nuevos datos </h1>
                        <Textarea
                            className="mt-2 min-h-[140px] resize-none"
                            value={anotacionConsulta}
                            onChange={(e) => setanotacionConsulta(e.target.value)}
                        ></Textarea>
                        <br/>

                        <div className="pt-6 flex justify-end">
                            <ShadcnButton
                                funcion={() => actualizarFicha(tipoAtencion, anotacionConsulta, id_ficha)}
                                nombre={"Actualizar"}/>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}