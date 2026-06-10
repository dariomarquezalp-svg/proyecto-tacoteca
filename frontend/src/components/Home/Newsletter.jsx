import React from "react";
import { MailIcon } from "lucide-react";

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("¡Suscrito al newsletter!");
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-8 rounded-3xl mx-auto shadow-sm mt-32 mb-20 max-w-7xl">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Icono de Correo */}
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow">
          <MailIcon className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
        </div>
        
        {/* Títulos */}
        <h2 className="text-3xl font-semibold text-emerald-800 mb-4">
          Subscribe to our Newsletter {/* 🌟 Corregido: "Subscirbe" */}
        </h2>
        <p className="text-gray-600 mb-8">
          Get weekly updates on fresh produce, seasonal offers, and exclusive discounts right to your inbox. {/* 🌟 Corregido: "exluxive" y "rigth" */}
        </p>
        
        {/* Formulario */}
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input 
            type="email" 
            placeholder="Enter your email address" 
            required 
            className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none bg-white text-sm transition-all"
          /> {/* 🌟 Corregido: Comillas y tag de cierre del input */}

          <button 
            type="submit" 
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap active:scale-[0.98]"
          >
            Subscribe {/* 🌟 Corregido: ¡Ahora el botón sí tiene texto! */}
          </button>
        </form>

      </div>
    </section>
  );
};

export default Newsletter;