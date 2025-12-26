import { Sour_Gummy } from "next/font/google";

const sourGummy = Sour_Gummy({
  subsets: ["latin"], // debes elegir los subsets
  weight: ["400", "500", "700"], // los pesos que quieras usar
});



export default function PrimeraSesion(){
    return(
        <div className="w-full py-6 sm:py-8 md:py-10">
            <div className={`${sourGummy.className} flex justify-center items-center px-4 text-center`}>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-rose-400 leading-relaxed">
                    Regálate este momento para ti… primera sesión con precio especial
                </h1>
            </div>
        </div>
    )
}