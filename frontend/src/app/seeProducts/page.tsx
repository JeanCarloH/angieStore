"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import Image from "next/image";
import loadingImage from "/public/images/bannervals.jpg"; 
export default function VerProductos() {
  interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    images: string[];
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(productsData);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-4">
      <h1 className="text-2xl font-bold mb-4 flex justify-center">Administrar Productos</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
        <Image src={loadingImage} alt="Cargando..." width={400} height={100} className="animate-pulse rounded-3xl" />
      </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 sx:text-xs sm:text-sm md:text-lg lg:text-lg ">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Imagen</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Categoría</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="text-center">
                  <td className="border p-2">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.category}</td>
                  <td className="border p-2">${product.price}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                    >
                      ❌ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No hay productos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
