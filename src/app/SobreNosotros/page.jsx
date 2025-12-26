import Image from "next/image";

// Base de la API configurable por entorno (dev/prod)
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function cargarTitulos() {
    try {
        const res = await fetch(`${API}/titulo`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000)
        });

        if (!res.ok) {
            console.warn('No se pudieron cargar los títulos:', res.status);
            return [];
        }

        const dataTitulos = await res.json();
        return dataTitulos;
    } catch (error) {
        console.warn('Error al cargar títulos (puede ser normal durante build):', error.message);
        return [
            {id_titulo: 3, titulo: '¿Quiénes Somos?'},
            {id_titulo: 4, titulo: '¿Qué Hacemos?'}
        ];
    }
}

async function cargarTextos() {
    try {
        const res = await fetch(`${API}/textos`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000)
        });

        if (!res.ok) {
            console.warn('No se pudieron cargar los textos:', res.status);
            return [];
        }

        const textodata = await res.json();
        return textodata;
    } catch (error) {
        console.warn('Error al cargar textos (puede ser normal durante build):', error.message);
        return [
            {id_Textos: 1, texto: 'Texto por defecto sobre quiénes somos'},
            {id_Textos: 2, texto: 'Texto por defecto sobre qué hacemos'}
        ];
    }
}

export default async function SobreNosotros() {
    const titulos = await cargarTitulos();
    const quienesSomos = titulos.find((item) => item.id_titulo === 3);
    const quehacemos = titulos.find((item) => item.id_titulo === 4);

    const textos = await cargarTextos();
    const textoQuienesSomos = textos.find((item) => item.id_Textos === 1);
    const textoQueHacemos = textos.find((item) => item.id_Textos === 2);

    return (
        /** CONTENEDOR PRINCIPAL  */
        <div className="w-full overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                {/** PRIMERA SECCIÓN - QUIÉNES SOMOS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-16">
                    {/** IMAGEN */}
                    <div className="flex justify-center lg:col-span-1 order-2 lg:order-1">
                        <Image
                            alt="Imagen de Denis Beltrán"
                            src={"/denis.png"}
                            width={500}
                            height={300}
                            className="rounded-2xl w-full max-w-sm lg:max-w-full h-auto shadow-lg"
                        />
                    </div>

                    {/** CONTENIDO TEXTO */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        {quienesSomos && (
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-rose-600 mb-6">
                                {quienesSomos.titulo}
                            </h1>
                        )}

                        {textoQuienesSomos && (
                            <p className="text-base sm:text-lg lg:text-xl text-justify leading-relaxed">
                                {textoQuienesSomos.contenido}
                            </p>
                        )}
                    </div>
                </div>

                {/** SEGUNDA SECCIÓN - QUÉ HACEMOS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/** CONTENIDO TEXTO */}
                    <div className="order-1">
                        {quehacemos && (
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-rose-600 mb-6">
                                {quehacemos.titulo}
                            </h1>
                        )}

                        {textoQueHacemos && (
                            <p className="text-base sm:text-lg lg:text-xl text-justify leading-relaxed">
                                {textoQueHacemos.contenido}
                            </p>
                        )}
                    </div>

                    {/** IMAGEN */}
                    <div className="flex justify-center order-2">
                        <Image
                            alt="Imagen de servicios"
                            src={"/image1.png"}
                            width={400}
                            height={400}
                            className="rounded-2xl w-full max-w-sm lg:max-w-full h-auto shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
