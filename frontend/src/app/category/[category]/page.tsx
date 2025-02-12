"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useCart } from "@/app/context/cartContext";
import { ShoppingCart } from "lucide-react";
import loadingImage from "/public/images/bannervals.jpg"; 

export default function CategoryPage() {
      const { addToCart, cart, removeFromCart } = useCart();
  const { category } = useParams(); // Obtiene la categoría desde la URL
  interface Product {
    id: string;
    category: string;
    name: string;
    price: number;
    images: string[];
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const allProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          category: doc.data().category,
          name: doc.data().name,
          price: doc.data().price,
          images: doc.data().images,
        }));
  
        // Filtrar productos por categoría
        const filteredProducts = allProducts.filter(
          (product) => product.category === category
        );
  
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };
  
    fetchProducts();
  }, [category]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 2; 
   // 📌 Calcular los productos a mostrar en la página actual
   const indexOfLastProduct = currentPage * productsPerPage;
   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
   const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
   const totalPages = Math.ceil(products.length / productsPerPage);
   // Calcular el total del carrito
  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };
  const handleCheckout = () => {
    const phoneNumber = "573218516928"; // Número de WhatsApp (sin el +)
    const message = encodeURIComponent(
      `Hola, quiero hacer un pedido:\n\n` +
        cart.map((item) => `🛒 ${item.name} ${item.sizes} - ${item.quantity} x $${item.price}`).join("\n") +
        `\n\n💰 Total: $${getTotal()}`
    );
  
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank"); // Abrir en una nueva pestaña
  };
  const router = useRouter();
  const [loading , setLoading] = useState(true);
  return (
    <>
    <div className="max-w-6xl mx-auto p-6 mt-32">
      <h1 className="text-3xl font-bold text-center mb-6">Categoría: {category}</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
        <Image src={loadingImage} alt="Cargando..." width={400} height={100} className="animate-pulse rounded-3xl" />
      </div>
    ) : (
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.id}
               className="relative group cursor-pointer rounded-xl overflow-hidden"
              onClick={() => router.push(`/productInfo/${product.id}`)}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={300}
                height={300}
               className="w-full h-96 object-cover transition-transform group-hover:scale-105 duration-300"
              />
             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-white text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-300">${product.price}</p>
            </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No hay productos en esta categoría.</p>
        )}
      </div>
    )}
    </div>
    {/* 📌 PAGINACIÓN CON SHADCN */}
    <div className="flex justify-center mt-6 mb-6">
        <Pagination>
          <PaginationContent>
            {/* Botón Anterior */}
            <PaginationItem>
              <PaginationPrevious onClick={() => currentPage > 1 && setCurrentPage((prev) => Math.max(prev - 1, 1))} />
            </PaginationItem>

            {/* Números de página */}
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Botón Siguiente */}
            <PaginationItem>
              <PaginationNext onClick={() => currentPage < totalPages && setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 bg-primary hover:bg-secondary text-white flex items-center px-4 py-2  shadow-lg transition-all duration-300 transform hover:scale-110 rounded-2xl">
            <ShoppingCart className="mr-2" /> Carrito ({cart.length})
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <DialogTitle className="text-2xl font-semibold">Carrito de compras</DialogTitle>
          <h2 className="text-lg font-semibold mb-4">Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío.</p>
          ) : (
            <>
              <ul>
                {cart.map((item, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                    <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-500">
                        ${item.price} x {item.quantity} = <span className="font-bold">${item.price * item.quantity}</span>
                      </p>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="text-red-500">✖</button>
                  </li>
                ))}
              </ul>

              {/* Total */}
              <div className="mt-6 p-4 bg-gray-200 rounded-lg text-lg font-semibold flex justify-between">
                <p className="text-lg font-semibold">Total: ${getTotal()}</p>
              </div>

              {/* Botón "Ir a Pagar" */}
              <Button className="w-full mt-4 bg-black text-white py-2 rounded-lg" onClick={handleCheckout}>
                Ir a Pagar
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
      </>
  );
}
