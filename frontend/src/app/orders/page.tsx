"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { Card, CardContent } from "@/components/ui/card";

export default function Orders() {
  interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sizes?: string[];
  }

  interface Order {
    id: string;
    name: string;
    lastname: string;
    phone: string;
    address: string;
    date: string;
    items: OrderItem[];
    total: number;
  }

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = Timestamp.fromDate(today);

        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("createdAt", ">=", todayTimestamp));
        const querySnapshot = await getDocs(q);

        const ordersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            lastname: data.lastname,
            phone: data.phone,
            address: data.address,
            date: data.date,
            items: data.items || [],
            total: data.total,
          };
        });
        console.log("recibiendo data en orders", ordersList)
        setOrders(ordersList);
      } catch (error) {
        console.error("Error obteniendo órdenes:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-32 mb-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">Órdenes de Hoy</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No hay órdenes para hoy.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="shadow-lg ">
            <CardContent className="p-4 ">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">📌 Cliente:</h2>
                <p>
                  <span className="font-bold">{order.name} {order.lastname}</span>
                </p>
                <p>📞 <span className="font-medium">{order.phone}</span></p>
                <p>🏠 <span className="font-medium">{order.address}</span></p>
                <p>📅 <span className="font-medium">{order.date}</span></p>
              </div>

              <div className="border-t pt-4 ">
                <h2 className="text-lg font-semibold">🛒 Productos:</h2>
                <ul className="mt-2 space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{item.name} {item.sizes && item.sizes.length > 0 ? `(${item.sizes.join(", ")})` : ""}</p>
                        <p className="text-gray-500">Cantidad: {item.quantity}x</p>
                      </div>
                      <p className="text-green-600 font-semibold">${item.price * item.quantity}</p>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-center font-semibold text-lg mt-4">
                  <p className="text-gray-700">Total:</p>
                  <p className="text-green-700">${order.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
