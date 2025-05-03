"use client";

import { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";  // Asegúrate de importar Firebase Storage
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";  // Importa funciones de Firebase Storage
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function HandleBanner() {
  const [banners, setBanners] = useState<{ id: string; imageUrl: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false); // 🔄 Estado para forzar re-render

  useEffect(() => {
    fetchBanners();
  }, [refresh]); // 🔄 Se recarga automáticamente cuando cambia "refresh"

  // 🔥 Obtener banners de Firestore
  const fetchBanners = async () => {
    try {
      const bannersRef = collection(db, "banners");
      const querySnapshot = await getDocs(bannersRef);
      const bannersList = querySnapshot.docs.map((doc) => ({ id: doc.id, imageUrl: doc.data().imageUrl }));
      setBanners(bannersList);
    } catch (error) {
      console.error("Error al obtener banners:", error);
    }
  };

  // 🔥 Manejar el cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // 🔥 Subir imagen a Firebase Storage y almacenar URL en Firestore
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Crear referencia para el archivo en Firebase Storage
      const storageRef = ref(storage, `banners/${fileName}`);
      
      // Subir el archivo
      await uploadBytes(storageRef, file);
      
      // Obtener la URL de descarga del archivo
      const downloadURL = await getDownloadURL(storageRef);

      // Guardar la URL en Firestore
      await addDoc(collection(db, "banners"), { imageUrl: downloadURL });

      setFile(null);
      setFileName(null);
      setRefresh((prev) => !prev); // 🔄 Forzar re-render
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
    }

    setLoading(false);
  };

  // 🔥 Eliminar imagen de Firebase Storage y Firestore
  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      // Eliminar la imagen de Firebase Storage
      const imageRef = ref(storage, imageUrl); // Referencia a la imagen en Firebase Storage
      await deleteObject(imageRef);

      // Eliminar la URL de Firestore
      await deleteDoc(doc(db, "banners", id));

      setRefresh((prev) => !prev); // 🔄 Forzar re-render
    } catch (error) {
      console.error("Error al eliminar el banner:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-32 p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h1 className="text-2xl font-bold text-center">📸 Gestionar Banners</h1>

      {/* 📌 Subir una imagen */}
      <div className="flex flex-col items-center space-y-4">
        <Input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
        {file && (
          <div className="flex flex-col items-center">
            <Image src={URL.createObjectURL(file)} alt="Preview" width={250} height={125} className="rounded-lg shadow-md" />
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="mt-4 bg-black text-white px-4 py-2 rounded-xl k transition "
            >
              {loading ? "Subiendo..." : "Subir Imagen"}
            </Button>
          </div>
        )}
      </div>

      {/* 📌 Mostrar banners actuales */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="relative">
            <CardContent className="p-3 flex flex-col items-center">
              <Image src={banner.imageUrl} alt="Banner" width={200} height={100} className="rounded-lg shadow-md" />
              <Button
                onClick={() => handleDelete(banner.id, banner.imageUrl)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                Eliminar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
