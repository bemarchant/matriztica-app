"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Día", icon: "📅" },
    { href: "/calendar", label: "Calendario", icon: "📆" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-purple-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">✨</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-brand to-pink-500 bg-clip-text text-transparent">
              Matríztica
            </h1>
          </Link>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === "/" && pathname === "/") ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-brand bg-purple-50 font-semibold"
                      : "text-slate-700 hover:text-brand hover:bg-purple-50/50"
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

