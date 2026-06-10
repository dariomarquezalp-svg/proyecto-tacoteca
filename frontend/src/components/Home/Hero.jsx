import { Link } from "react-router-dom"
import { Leaf as LeafIcon, ArrowRight as ArrowRightIcon } from "lucide-react"

const heroSectionData = {
  hero: {
    // 📸 Actualizado: Imagen premium de tacos en alta definición con tonos oscuros
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1470&auto=format&fit=crop" 
  },
  description: "Descubre los ingredientes orgánicos más frescos, entregados directamente en tu puerta, para que tu familia esté sana y feliz."
}

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[550px] mb-10 rounded-3xl flex items-center bg-[#121212] border border-zinc-800/40">

        {/* Imagen de Fondo */}
        <img 
          src={heroSectionData.hero.image} 
          alt="Hero Tacoteca" 
          className="absolute inset-0 h-full w-full object-cover opacity-45 object-right md:object-center" 
        />

        {/* Degradado Negro Absoluto difuminado */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/85 to-transparent"/>

        {/* Contenedor del Contenido Principal */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 w-full z-10">
            
            {/* Contenedor de Texto y Botones */}
            <div className="max-w-xl">
                {/* Badge Orgánico con texto naranja */}
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#FF8C00] bg-[#FF8C00]/10 rounded-full mb-5 border border-[#FF8C00]/20 tracking-wide">
                    <LeafIcon className="size-3"/> Productos frescos de la granja y orgánicos.
                </span>

                {/* Título Principal: Cambiado de verde a Naranja Tacoteca en el texto secundario */}
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] mb-5 font-medium">
                    Nutre tu hogar con <br />
                    <span className="text-[#FF8C00] font-normal">lo mejor de la Tierra.</span>
                </h1>

                {/* Descripción en Español */}
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 max-w-md">
                    {heroSectionData.description}
                </p>

                {/* Botones de Acción */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Botón naranja plano limpio (Sin sombras/iluminación externa) */}
                    <Link to='/products' className="px-7 py-3 bg-[#FF8C00] text-white font-semibold text-sm rounded-full 
                    hover:bg-[#e07b00] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                        Compra ahora <ArrowRightIcon className="size-4 text-white"/>
                    </Link>

                    <Link to='/products' className="px-7 py-3 bg-zinc-900/40 text-zinc-300 font-medium text-sm rounded-full
                    hover:bg-zinc-900 transition-all border border-zinc-800/60 text-center">
                        Explorar categorías 
                    </Link>
                </div>
            </div>

        </div>

    </section>
  )
}

export default Hero