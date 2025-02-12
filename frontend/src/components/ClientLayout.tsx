"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/ui/TopBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <>
      {pathname !== "/login" && <TopBar />} {/* Oculta la barra en /login */}
      <main>{children}</main>
    </>
  );
}
