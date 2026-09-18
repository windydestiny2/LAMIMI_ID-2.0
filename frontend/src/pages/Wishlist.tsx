import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Book } from "@/lib/types";
import { apiGet } from "@/lib/api";
import { getWishlist } from "@/lib/wishlist";
import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Wishlist() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => { const sync = () => setIds(getWishlist()); sync(); window.addEventListener("lamimi-wishlist-change", sync); return () => window.removeEventListener("lamimi-wishlist-change", sync); }, []);
  const { data: books } = useQuery({ queryKey: ["books", "wishlist"], queryFn: () => apiGet<Book[]>("/books") });
  const saved = (books ?? []).filter((book) => ids.includes(book.id));
  return <div className="min-h-screen bg-[#FAF7F2]"><Navbar /><main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C05621]">Pilihanmu</p><h1 className="mt-3 font-heading text-4xl font-bold">Wishlist</h1><p className="mt-3 text-[#635F59]">Buku yang kamu simpan di perangkat ini.</p>{saved.length ? <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{saved.map((book) => <BookCard key={book.id} book={book} />)}</div> : <div className="mt-10 rounded-2xl border border-dashed border-[#E8DFC8] bg-white p-10 text-center"><Heart className="mx-auto mb-3 size-8 text-[#DD6B20]" /><p className="text-sm text-[#635F59]">Belum ada buku di wishlist.</p><Link to="/etalase/digital" className="mt-4 inline-flex rounded-full bg-[#DD6B20] px-5 py-2.5 text-sm font-semibold text-white">Jelajahi ebook</Link></div>}</main><Footer /></div>;
}
