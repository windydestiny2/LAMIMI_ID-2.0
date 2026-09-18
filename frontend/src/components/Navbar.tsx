import { Link, NavLink } from "react-router-dom";
import { BookOpen, Heart, Menu, MessageCircle, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { WA_NUMBER } from "@/lib/types";
import { getCustomerProfile, syncCustomerData } from "@/lib/customer";

const LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/etalase/digital", label: "Ebook Digital" },
  { to: "/etalase/fisik", label: "Buku Fisik" },
  { to: "/lacak", label: "Lacak Pesanan" },
  { to: "/artikel", label: "Artikel" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/about-us", label: "About Us" },
];

export function Navbar() {
  const customer = useQuery({ queryKey: ["customer-me"], queryFn: getCustomerProfile, retry: false, staleTime: 60_000 });
  const accountPath = customer.data ? "/akun" : "/masuk";
  useEffect(() => {
    if (!customer.data) return;
    const sync = () => { void syncCustomerData(); };
    window.addEventListener("lamimi-cart", sync);
    window.addEventListener("lamimi-wishlist-change", sync);
    return () => {
      window.removeEventListener("lamimi-cart", sync);
      window.removeEventListener("lamimi-wishlist-change", sync);
    };
  }, [customer.data]);
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8DFC8]/70 bg-[#FAF7F2]/85 backdrop-blur-xl" data-testid="main-nav">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#DD6B20] text-white shadow-sm">
            <BookOpen className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">LAMIMI_ID</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/ /g, "-")}`}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-[#F5EDE0] text-[#9C4221]" : "text-[#635F59] hover:text-[#1F1D1A]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartDrawer />
          <Link to="/wishlist" aria-label="Buka wishlist" className="hidden rounded-full p-2 text-[#635F59] hover:bg-[#F5EDE0] hover:text-[#C05621] sm:block"><Heart className="size-5" /></Link>
          <Link to={accountPath} aria-label={customer.data ? "Buka akun" : "Masuk atau daftar"} className="hidden rounded-full p-2 text-[#635F59] hover:bg-[#F5EDE0] hover:text-[#C05621] sm:block"><UserRound className="size-5" /></Link>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" data-testid="nav-whatsapp-button" className="hidden sm:block">
            <Button className="rounded-full bg-[#1F1D1A] text-white hover:bg-[#3a352f]">
              <MessageCircle className="size-4" /> Chat Admin
            </Button>
          </a>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" className="rounded-full md:hidden" data-testid="nav-mobile-menu-button" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FAF7F2]">
              <SheetTitle className="font-heading text-lg font-bold">LAMIMI_ID</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/ /g, "-")}`}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-medium ${isActive ? "bg-[#F5EDE0] text-[#9C4221]" : "text-[#635F59]"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
