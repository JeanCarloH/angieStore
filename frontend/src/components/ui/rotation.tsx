import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function RotatingGear() {
  return (
    <motion.div
      className="flex items-center justify-center p-8 rounded-full bg-[#2a173a] shadow-[0_10px_30px_rgba(255,255,255,0.3)]"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
    >
      <Settings className="w-24 h-24 text-white drop-shadow-[0_5px_10px_rgba(255,255,255,0.5)]" />
    </motion.div>
  );
}
