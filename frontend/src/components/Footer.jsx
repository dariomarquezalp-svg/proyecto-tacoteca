import React from "react";
import { Link } from "react-router-dom"; 
import { UtensilsIcon } from "lucide-react"; // 🌮 Cambiado BikeIcon por uno gastronómico más acorde
import { footerData } from "../assets/assets";

const Footer = () => {
  return (
    /* 🔄 REEMPLAZADO: De bg-emerald-950 a un Gris Oscuro Estilo Tacoteca */
    <footer className="bg-[#121212] text-white mt-20 border-t border-zinc-800"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* INYECCIÓN DE ESTILOS DE FUERZA BRUTA PARA EL CONTENIDO DINÁMICO DEL NEWSLETTER */}
        <style>{`
          /* Forzar el título dinámico "Subscribe to our Newsletter" a color Naranja */
          footer h2, 
          footer h3:contains("Subscribe"),
          footer *:contains("Newsletter") {
            color: #FF8C00 !important;
          }
          /* Forzar el botón "Subscribe" dinámico a ser Naranja con texto Oscuro */
          footer button,
          footer input[type="submit"],
          footer .bg-emerald-600,
          footer button:contains("Subscribe") {
            background-color: #FF8C00 !important;
            color: #121212 !important;
            font-weight: 800 !important;
            border-radius: 8px !important;
          }
          /* Cambiar el icono de la carta dinámico si existe */
          footer svg[class*="text-emerald"] {
            color: #FF8C00 !important;
            stroke: #FF8C00 !important;
          }
        `}</style>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Columna 1: Brand & Socials */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <UtensilsIcon className="w-5 h-5 text-[#FF8C00]" /> {/* Icono gastronómico en naranja */}
              <span className="text-xl font-black uppercase tracking-tight">
                TACO<span className="text-[#FF8C00]">TECA</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400">
              {footerData?.brand?.description || "Los mejores tacos al pastor, de asada, gringas y campechanos directo a tu mesa."}
            </p>
            <div className="flex gap-3 mt-2">
              {footerData?.brand?.socials?.map((social, i) => {
                const SocialIcon = social.icon;
                return (
                  <a 
                    key={i} 
                    href={social.link} 
                    className="w-9 h-9 rounded-lg bg-zinc-850 flex items-center justify-center hover:bg-[#FF8C00] hover:text-[#121212] transition-all"
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columnas 2 y 3: Secciones dinámicas (Links del menú) */}
          {footerData?.sections?.map((section, i) => (
            <div key={i}>
              {/* Cambiado el color de los títulos de sección a un Naranja sutil */}
              <h3 className="text-xs font-bold uppercase mb-4 tracking-wider text-[#FF8C00]">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {link.to ? (
                      <Link to={link.to} className="text-sm text-zinc-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Columna 4: Contact Us */}
          <div>
            <h3 className="text-xs font-bold uppercase mb-4 tracking-wider text-[#FF8C00]">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {footerData?.contact?.map((item, i) => {
                const ContactIcon = item.icon;
                return (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                    <ContactIcon className="w-4 h-4 text-zinc-400 shrink-0 group-hover:text-[#FF8C00]" /> 
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* Barra Inferior (Copyright) */}
        <div className="border-t border-zinc-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            &copy; 2026 TACOTECA. All rights reserved.
          </p>
          <div className="flex gap-4">
            {footerData?.bottom?.links?.map((link, i) => (
              <a 
                key={i} 
                href={link.href} 
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;