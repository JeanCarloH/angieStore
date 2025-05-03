"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Image from "next/image";
import Swal from "sweetalert2";
import loadingImage from "/public/images/bannervals.jpg"; 
import { ref, deleteObject } from "firebase/storage"; 
import { storage } from "../../../firebase";
export default function VerProductos() {
  interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    images: string[];
    availability: number; // Ahora es un número
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAvailability, setEditingAvailability] = useState<{ [key: string]: number }>({});

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
  const deleteProduct = async (product: Product) => {
    // Confirmación con SweetAlert2
    const result = await Swal.fire({
      title: `¿Seguro que quieres eliminar ${product.name}?`,
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (!result.isConfirmed) return;
  
    try {
      // Eliminar todas las imágenes asociadas al producto (si tiene imágenes)
      product.images.forEach(async (image) => {
        const imageRef = ref(storage, image);  // Referencia a cada archivo en Firebase Storage
        await deleteObject(imageRef);
      });
  
      // Eliminar el producto de Firestore
      await deleteDoc(doc(db, "products", product.id));
  
      // Actualizar el estado local para reflejar la eliminación
      setProducts(products.filter((prod) => prod.id !== product.id));
  
      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        text: `${product.name} ha sido eliminado correctamente.`,
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el producto.",
      });
    }
  };

  const updateAvailability = async (id: string) => {
    if (editingAvailability[id] === undefined) return;

    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { availability: editingAvailability[id] });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, availability: editingAvailability[id] } : product
        )
      );

      setEditingAvailability((prev) => {
        const newState = { ...prev };
        delete newState[id]; // Remueve el estado de edición después de guardar
        return newState;
      });

      Swal.fire({
        icon: "success",
        title: "Disponibilidad actualizada",
        text: `Nueva cantidad: ${editingAvailability[id]}`,
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error al actualizar disponibilidad:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 p-4">
      <h1 className="text-2xl font-bold mb-4 flex justify-center">Administrar Productos</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Image src={loadingImage} alt="Cargando..." width={400} height={100} className="animate-pulse rounded-3xl" />
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm md:text-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Imagen</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Categoría</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Disponibilidad</th>
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
                    <input
                      type="number"
                      value={editingAvailability[product.id] ?? product.availability}
                      onChange={(e) =>
                        setEditingAvailability({
                          ...editingAvailability,
                          [product.id]: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-16 text-center border p-1 rounded"
                    />
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => updateAvailability(product.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={() => deleteProduct(product)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      ❌ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
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
