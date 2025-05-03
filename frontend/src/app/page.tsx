"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../../firebase"; // Asegúrate de importar correctamente tu configuración de Firebase
import { collection, getDocs } from "firebase/firestore";
import ProductGrid from "@/components/productsGrid";

export default function Home() {
  const [banners, setBanners] = useState<string[]>([]);

  // 🔥 Obtener imágenes desde Firestore
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersRef = collection(db, "banners");
        const querySnapshot = await getDocs(bannersRef);
        const imageUrls = querySnapshot.docs.map((doc) => doc.data().imageUrl); // Extraer imageUrl de cada documento
        setBanners(imageUrls);
      } catch (error) {
        console.error("Error al obtener banners:", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="w-full flex items-center justify-center mt-32">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="w-full h-[500px]"
        >
          {banners.length > 0 ? (
            banners.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center text-gray-500">
              No hay banners disponibles.
            </div>
          )}
        </Swiper>
      </div>
      <ProductGrid />
    </div>
  );
}
