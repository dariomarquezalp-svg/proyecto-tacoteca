import { Link } from "react-router-dom"

// Datos de prueba para que el mapeo funcione perfectamente.
const categoriesData = [
  { name: "Fruits", slug: "fruits", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=150&q=80" },
  { name: "Vegetables", slug: "vegetables", image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=150&q=80" },
  { name: "Bakery", slug: "bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80" },
  { name: "Meat", slug: "meat", image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=150&q=80" }
]

const HomeCategories = () => {
  return (
    <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
            {/* Títulos alineados a la izquierda originalmente */}
            <h2 className="text-2xl font-semibold text-zinc-900">Browse Categories</h2>
            <p className="text-sm text-zinc-500 mt-1">Find exactly what you need using our selection</p>
            
            {/* Contenedor de imágenes alineado al centro */}
            <div className="flex flex-wrap items-center justify-center mt-8 gap-6 w-full">
                {categoriesData.map((cat) => (
                    <Link 
                        key={cat.slug} 
                        to={`/products?category=${cat.slug}`}
                        onClick={() => window.scrollTo(0, 0)} 
                        className="group flex flex-col items-center gap-3 p-2 transition-transform duration-200 hover:-translate-y-1"
                    >
                        <div className="size-20 sm:size-24 rounded-2xl overflow-hidden bg-orange-50 group-hover:ring-2 ring-orange-300/75 transition-all flex items-center justify-center p-2 shadow-sm border border-orange-100/50">
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="w-full h-full object-cover rounded-xl transition-all group-hover:scale-105" 
                            />
                        </div>
                        <span className="text-sm font-medium text-zinc-700 group-hover:text-orange-500 transition-colors">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    </section>
  )
}

export default HomeCategories