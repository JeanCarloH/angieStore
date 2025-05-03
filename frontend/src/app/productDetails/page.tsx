"use client";
import * as React from "react";
import { useState } from "react";
import { useCart } from "@/app/context/cartContext";
import { useRouter } from "next/navigation";
import { db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export default function ProductDetails() {
    const { cart } = useCart();
    const router = useRouter();

    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleSaveOrder = async () => {
        if (!name || !lastname || !phone || !address || !date) {
            alert("Por favor completa todos los campos.");
            return;
        }

        try {
            const orderData = {
                name,
                lastname,
                phone,
                address,
                date: date.toISOString().split("T")[0],
                items: cart,
                total: totalCartPrice,
                status: "Pendiente",
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "orders"), orderData);
            handleCheckout();
            router.push("/");
        } catch (error) {
            console.error("Error guardando el pedido:", error);
        }
    };

    const handleCheckout = () => {
        const phoneNumber = "573218516928"; // Número de WhatsApp (sin el +)
        const message = encodeURIComponent(
          `Hola, quiero hacer un pedido:\n\n` +
          cart.map((item) => `🛒 nombre ${item.name}  - cantidad ${item.quantity} x $${item.price}`).join("\n") +
          `\n\n💰 Total: $${totalCartPrice}`
        );
    
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
        // 🔥 Asegurar que se abra correctamente en otra pestaña
        const newTab = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    
       
    };
    
    return (
        <div className="max-w-4xl mx-auto p-6 mt-20 bg-white shadow-lg rounded-lg">
            {/* Contenedor con Grid para 2 columnas en escritorio y 1 en móvil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Columna izquierda: Formulario de datos */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">📋 Detalles del Pedido</h2>

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="text"
                            placeholder="Apellido"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="tel"
                            placeholder="Celular"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="text"
                            placeholder="Dirección"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Columna derecha: Resumen del pedido */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">🛒 Resumen del Pedido</h2>

                    <div className="border-b pb-2 mb-2 flex justify-between text-gray-500 text-sm font-semibold">
                        <span className="w-1/3 text-left">Producto</span>
                        <span className="w-1/4 text-center">Cantidad</span>
                        <span className="w-1/4 text-right">Precio</span>
                    </div>

                    <ul className="mb-4">
                        {cart.map((item, index) => (
                            <li key={index} className="flex justify-between items-center border-b py-2">
                                <p className="w-1/3 text-left font-medium">{item.name}</p>
                                <p className="w-1/4 text-center">{item.quantity}x</p>
                                <p className="w-1/4 text-right text-green-600 font-semibold">${item.price * item.quantity}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-between items-center font-semibold text-lg mt-4">
                        <p className="text-gray-700">Total:</p>
                        <p className="text-green-700">${totalCartPrice}</p>
                    </div>
                </div>
            </div>

            {/* Sección de Fecha + Botón */}
            <div className="mt-6">
                <p className="text-gray-600 flex justify-center">📅 Selecciona la fecha de entrega:</p>
                <div className="flex justify-center my-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow"
                    />
                </div>

                <Button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900" onClick={handleSaveOrder}>
                    Guardar Pedido
                </Button>
            </div>
        </div>
    );
}

