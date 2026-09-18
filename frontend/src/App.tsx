import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import BookDetail from "@/pages/BookDetail";
import Checkout from "@/pages/Checkout";
import TrackOrder from "@/pages/TrackOrder";
import AboutUs from "@/pages/AboutUs";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import Wishlist from "@/pages/Wishlist";
import CustomerAuth from "@/pages/CustomerAuth";
import Account from "@/pages/Account";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/etalase/digital" element={<Catalog kind="digital" />} />
        <Route path="/etalase/fisik" element={<Catalog kind="fisik" />} />
        <Route path="/buku/:id" element={<BookDetail />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/lacak" element={<TrackOrder />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/artikel" element={<Articles />} />
        <Route path="/artikel/:slug" element={<ArticleDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/masuk" element={<CustomerAuth mode="login" />} />
        <Route path="/daftar" element={<CustomerAuth mode="signup" />} />
        <Route path="/akun" element={<Account />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
