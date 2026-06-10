import { useState } from 'react'
import { Truck as TruckIcon, X as XIcon, ZapIcon } from 'lucide-react' 

const Banner = () => {

    const [bannerVisible, setBannerVisible] = useState(() => {
        return sessionStorage.getItem('banner_dismissed') !== 'true' 
    })

    const dismissBanner = () => {
        setBannerVisible(false)
        sessionStorage.setItem('banner_dismissed', 'true')
    }

  return (
    <div>
        {bannerVisible && (
            /* 🔄 REEMPLAZADO: De degradado verde a Negro/Gris Oscuro con borde inferior sutil */
            <div className="bg-gradient-to-r from-[#121212] via-[#1a1a1a] to-[#121212] text-white text-xs sm:text-sm relative overflow-hidden border-b border-zinc-800/80">
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-6">
                    
                    {/* Mensaje de Envío - Letras en blanco y sin cohete */}
                    <div className="flex items-center justify-center gap-2">
                        <TruckIcon className="size-4 text-[#FF8C00] shrink-0"/> {/* Icono Naranja */}
                        <span className="font-bold tracking-wide uppercase text-[11px] sm:text-xs text-white">
                          Envío gratis en órdenes mayores a $200
                        </span>
                    </div>
                    
                    <span className="hidden sm:inline text-zinc-700">|</span>
                    
                    {/* Mensaje de Entrega - Cambiado de text-zinc-300 a text-white */}
                    <div className="hidden sm:flex items-center gap-2">
                        <ZapIcon className="size-3.5 fill-[#FF8C00] text-[#FF8C00] shrink-0"/> {/* Rayo Naranja */}
                        <span className="font-medium text-white text-[11px] sm:text-xs uppercase tracking-wider">
                          Taco-Express Calientito Garantizado
                        </span>
                    </div>
                </div>

                {/* Botón de cerrar banner */}
                <button onClick={dismissBanner} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 text-zinc-400 hover:text-white rounded-full transition-colors cursor-pointer">
                    <XIcon className="size-3.5"/>
                </button>

            </div>
        )}
    </div>
  )
}

export default Banner;