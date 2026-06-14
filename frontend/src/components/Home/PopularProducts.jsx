import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import ProductCard from './ProductCard';
// Importamos los datos estáticos desde tu archivo de configuración (ajusta la ruta si cambia)
import { dummyProducts } from '../../assets/assets'; 

const PopularProducts = ({ products }) => {
  // 1. Si pasan productos por props los usamos; si no, usamos los dummyProducts
  const baseProducts = products && products.length > 0 ? products : dummyProducts;

  // 2. Mostrar los primeros 10 productos disponibles (ratings removed)
  const popularProducts = [...baseProducts]
    .filter((product) => product.stock > 0)
    .slice(0, 10);

  return (
    <section className="pb-16 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Populares</h2>
          <p className="text-sm text-gray-500 mt-1">
            Los favoritos de la casa
          </p>
        </div>
        <Link
          to="/products"
          className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      {/* 3. Renderizado condicional: si hay productos, muestra la cuadrícula; si no, el Empty State */}
      {popularProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
          {popularProducts.map((product) => (
            // Nota: Usa product._id o product.id según la estructura de tus datos
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-gray-200 bg-gradient-to-br from-orange-50 to-white">
          <div className="size-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
            <span className="text-3xl">🛒</span>
          </div>

          <h3 className="text-xl font-semibold text-zinc-900">
            No Popular Products Found
          </h3>

          <p className="text-sm text-gray-500 mt-2 max-w-md">
            We couldn&apos;t find any trending products right now. Check back
            later for fresh arrivals and top-rated grocery picks.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Browse Products
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default PopularProducts;