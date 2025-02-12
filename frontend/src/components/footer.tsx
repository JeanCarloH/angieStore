import Link from "next/link";
import { Facebook, Instagram, MessageCircle } from "lucide-react"; // Importar íconos

export default function Footer() {
  return (
    <footer className="bg-rosa text-white !important py-6 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* 📍 Encuéntranos */}
        <div>
          <h3 className="text-lg font-semibold">Encuéntranos</h3>
          <p className="text-gray-600 mt-2">
            <strong>Dirección:</strong> Medellín, Centro Comercial Japón, Local 203
            <br />
            Calle 48 #53-39
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Horario:</strong> Lunes a Sábado: 9:00 A.M. a 6:30 P.M.
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Teléfono:</strong> 312 775 8991
          </p>
        </div>

        {/* 📜 Enlaces */}
        <div>
          <h3 className="text-lg font-semibold">Enlaces rápidos</h3>
          <ul className="text-gray-600 mt-2 space-y-2">
            <li>
              <Link href="/terminos">
                <span className="hover:text-gray-400 cursor-pointer">Términos y condiciones</span>
              </Link>
            </li>
            <li>
              <Link href="/busqueda">
                <span className="hover:text-gray-400 cursor-pointer">Búsqueda</span>
              </Link>
            </li>
          </ul>

          {/* 🌍 Redes Sociales */}
          <h3 className="text-lg font-semibold mt-4">Síguenos</h3>
          <div className="flex space-x-4 mt-2">
            <Link href="https://www.instagram.com/vals__desing?igsh=dWNoMDUzd3p6NjMw" target="_blank">
              <Instagram className="w-6 h-6 text-gray-600 hover:text-pink-500 transition duration-300 mr-2" />
            </Link>
            <Link href="https://wa.me/573127758991" target="_blank">
              <MessageCircle className="w-6 h-6 text-gray-600 hover:text-green-500 transition duration-300" />
            </Link>

            <Link href="https://www.facebook.com/share/1AxLJGZdAu/?mibextid=wwXIfr" target="_blank">
              <Facebook className="w-6 h-6 text-gray-600 hover:text-blue-500 transition duration-300" />
            </Link>
          </div>
        </div>

        {/* 📩 Suscripción */}
        <div>
          <h3 className="text-lg font-semibold">Suscríbete para recibir novedades</h3>
          <p className="text-gray-600 mt-2">
            Obtén descuentos exclusivos por ser parte de nuestra comunidad
          </p>
          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="w-full px-4 py-2 rounded-l-lg text-black focus:outline-none"
            />
            <button className="bg-primary px-4 py-2 rounded-r-lg hover:bg-opacity-80">
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      {/* ⚡ Línea divisoria */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Todos los derechos reservados.
      </div>
    </footer>
  );
}
