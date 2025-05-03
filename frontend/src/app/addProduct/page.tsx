"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importamos funciones de Firebase Storage
import { storage } from "../../../firebase"; // Asegúrate de haber configurado Firebase Storage
import Image from "next/image";
import Swal from "sweetalert2"; // Importamos SweetAlert2

export default function AddProductPage() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    availability: "",
    images: [] as File[], // Imágenes en formato File (aún no subidas)
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Manejar selección de imágenes con validación de tamaño
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const validFiles: File[] = [];
    const newPreviewImages: string[] = [];

    selectedFiles.forEach((file) => {
      if (file.size > 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Imagen demasiado grande",
          text: `La imagen ${file.name} pesa más de 1MB. Por favor, redúcela antes de subirla.`,
        });
      } else {
        validFiles.push(file);
        newPreviewImages.push(URL.createObjectURL(file));
      }
    });

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
  };

  // Eliminar una imagen de la lista
  const handleRemoveImage = (index: number) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index),
    });

    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  // Función para subir las imágenes a Firebase Storage
  const uploadImages = async (images: File[]): Promise<string[]> => {
    const imageURLs: string[] = [];

    for (const image of images) {
      const imageRef = ref(storage, `products/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);
      imageURLs.push(imageUrl);
    }

    return imageURLs;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Subir las imágenes a Firebase Storage
      const imageUrls = await uploadImages(product.images);

      const newProduct = {
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        category: product.category,
        availability: parseFloat(product.availability),
        images: imageUrls, // Guardamos las URLs de las imágenes
      };

      // Agregar el producto a Firestore
      const docRef = await addDoc(collection(db, "products"), newProduct);

      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: `El producto ha sido agregado con éxito! ID: ${docRef.id}`,
      });

      // Resetear formulario
      setProduct({ name: "", price: "", description: "", category: "", availability: "", images: [] });
      setPreviewImages([]);
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el producto.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-36 mb-10">
      <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block font-medium">Nombre del Producto</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block font-medium">Precio</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        {/* Categoría */}
        <div>
          <label className="block font-medium">Categoría</label>
          <select name="category" value={product.category} onChange={handleChange} required className="w-full p-2 border rounded-md">
            <option value="">Seleccionar categoría</option>
            <option value="General">General</option>
            <option value="De Temporada">De Temporada</option>
          </select>
        </div>
        
        {/* Disponibilidad */}
        <div>
          <label className="block font-medium">Disponibilidad</label>
          <input
            type="number"
            name="availability"
            value={product.availability}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Subir Imágenes */}
        <div>
          <label className="block font-medium">Imágenes del Producto</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">Máximo 1MB por imagen</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {previewImages.map((src, index) => (
              <div key={index} className="relative">
                <Image src={src} alt={`Imagen ${index}`} width={64} height={64} className="w-16 h-16 object-cover rounded-md border" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Enviar */}
        <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition" disabled={loading}>
          {loading ? "Agregando..." : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
}
