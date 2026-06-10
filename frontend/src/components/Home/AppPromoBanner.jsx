import React from 'react';
// 🌟 IMPORTANTE: Importamos los datos y los assets desde tu archivo de configuración
import { appPromoBannerData, assets } from '../../assets/assets'; 

const AppPromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 my-14 bg-emerald-950 rounded-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 xl:px-10">
        
        {/* Lado del Texto */}
        <div className="text-center md:text-left flex-1">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">
            {appPromoBannerData?.title || "Get the App Now"}
          </h2>
          <p className="text-white/70 mb-6 max-w-md">
            {appPromoBannerData?.description || "Download our app for a better experience."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <button className="px-6 py-3 bg-white text-emerald-950 font-semibold rounded-xl hover:bg-orange-100 transition-colors">
              App Store
            </button>
            <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              Google Play
            </button>
          </div>
        </div>

        {/* Lado de la Imagen */}
        <div className="flex justify-center md:justify-end flex-1">
          <img 
            src={assets?.delivery_truck} 
            alt="Delivery Truck" 
            className="w-full max-w-xs sm:max-w-md object-contain"
          />
        </div>
        
      </div>
    </section>
  );
};

export default AppPromoBanner;