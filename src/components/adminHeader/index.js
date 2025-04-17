
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export default function AdminHeader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return !isAdmin && <Header />;
}
