"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Rotation from "@/components/ui/rotation";
import { useEffect, useState } from "react";
import Carousel from "@/components/ui/carouselSize";
import ProductGrid from "@/components/productsGrid";
const images = [
  "/images/bannervals.jpg",
  "/images/bannervals2.jpeg",
];

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const handleStorageChange = () => {
      setIsDark(localStorage.getItem("theme") === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const darkModeClasses = "bg-gradient-to-b from-[#05000f] to-[#1a0a2b] text-white !important";
  const lightModeClasses = "bg-gradient-to-b from-white to-[#dcdcdc] text-black !important";

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="w-full flex items-center justify-center mt-32 ">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="w-full h-[500px]" 
        >
          {images.map((src, index) => (
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
       
          ))}
        </Swiper>

      </div>
      <ProductGrid />
    </div>
  );
}
