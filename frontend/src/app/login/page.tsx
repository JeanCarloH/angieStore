"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/authContext"; // Asegúrate de importar correctamente tu contexto
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth(); // Obtener la función de login del contexto
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("entre a la funcion y estos son los datos que recibo",email,password)
    e.preventDefault();
    setError(""); // Limpiar error antes de intentar iniciar sesión

    try {
      await login(email, password);
      console.log("entre")
      router.push("/"); // Redirige después de iniciar sesión
    } catch (err) {
      setError("Correo o contraseña incorrectos");
      console.log("error",err)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
