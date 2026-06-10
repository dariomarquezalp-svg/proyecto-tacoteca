import { Truck, ShieldCheck, BadgePercent, Headphones } from "lucide-react"

// Datos de prueba para que el mapa funcione perfectamente. Ajusta los iconos si lo necesitas.
const heroSectionData = {
  hero_features: [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected" },
    { icon: BadgePercent, title: "Best Deals", desc: "Daily discounts" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated assistance" }
  ]
}

export const Features = () => {
  return (
    <section className="bg-white py-5 border border-gray-200 rounded-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {heroSectionData.hero_features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 py-3">
                        <div className="size-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 text-green-700">
                            <feature.icon className="size-5"/>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-green-700">{feature.title}</p>
                            <p className="text-xs text-zinc-500">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Features