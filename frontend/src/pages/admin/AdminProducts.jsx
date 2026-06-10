import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EditIcon, XIcon } from "lucide-react";

import Loading from "../../components/Loading";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      // Aseguramos que data.products exista y sea un arreglo
      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleMarkOutOfStock = async (id, name) => {
    if (!window.confirm(`¿Marcar "${name}" como fuera de stock?`)) return;
    try {
      // 💡 NOTA: Si tu backend elimina el producto usa .delete. 
      // Si tu backend solo cambia el stock a 0, recuerda cambiar esto por: api.put(`/products/${id}`, { stock: 0 })
      await api.delete(`/products/${id}`);
      toast.success("Producto actualizado");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar stock");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      <div className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap border-b border-white/5">
        <h2 className="text-base font-bold text-white">Inventario del Menú</h2>
        
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#FF8C00] text-white rounded-full hover:bg-opacity-90 transition-all font-bold text-xs"
        >
          <PlusIcon className="size-4" /> Agregar Platillo
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#1C1C1C] text-[#A7A7A7] uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Platillo</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[#EAEAEA]">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#A7A7A7]">
                  No se encontraron productos registrados.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                // 🛠️ SOLUCIÓN ID: Captura el id correcto ya sea id o _id de la Base de Datos
                const productId = product.id || product._id;
                // 🛠️ SOLUCIÓN PRECIO: Evita que crashee si el precio no es un número válido
                const productPrice = Number(product.price) || 0;

                return (
                  <tr key={productId} className="hover:bg-[#1F1F1F] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "https://via.placeholder.com/150"}
                          alt={product.name}
                          className="size-10 rounded-md object-cover bg-[#2A2A2A]"
                        />
                        <div>
                          <p className="font-bold text-white">{product.name}</p>
                          <p className="text-[11px] text-[#A7A7A7]">
                            {product.category || "General"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {currency}{productPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        product.stock > 0 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
                      }`}>
                        {product.stock > 0 ? `${product.stock} disp.` : "Agotado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${productId}/edit`}
                          className="p-2 text-[#A7A7A7] hover:text-white bg-[#2A2A2A] rounded-md transition-colors"
                        >
                          <EditIcon className="size-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleMarkOutOfStock(productId, product.name)}
                          className="p-2 text-[#A7A7A7] hover:text-red-400 bg-[#2A2A2A] rounded-md transition-colors cursor-pointer"
                        >
                          <XIcon className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}