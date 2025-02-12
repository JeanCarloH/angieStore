"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Definir el tipo de producto en el carrito
type CartItem = {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  image: string;
  quantity: number;
};

// Crear el contexto
const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  addToCart2: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}>({
  cart: [],
  addToCart: () => {},
  addToCart2: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Función para agregar al carrito
  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
  
      if (existingItem) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si el producto no está en el carrito, agrégalo con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };
  
  const addToCart2 = (product: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
  
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: product.quantity,
                sizes: [...product.sizes], // 🔥 Fusiona correctamente sin duplicar
              }
            : item
        );
        
      } else {
        return [...prevCart, product];
      }
    });
  
  };
  
  
  

  // Función para eliminar del carrito
  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };
  

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, addToCart2, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para consumir el carrito
export const useCart = () => useContext(CartContext);
