import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Article } from "@/lib/types";
import { apiGet } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Articles() {
  const { data, isLoading } = useQuery({ queryKey: ["articles"], queryFn: () => apiGet<Article[]>("/articles") });
  return (
    <div className="min-h-screen bg-[#FAF7F2]"><Navbar />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C05621]">LAMIMI Journal</p><h1 className="mt-3 font-heading text-4xl font-bold">Catatan belajar bahasa</h1><p className="mt-3 text-[#635F59]">Panduan memilih buku, strategi belajar, dan rekomendasi bacaan dari LAMIMI_ID.</p></div>
        {isLoading && <p className="mt-10 text-sm text-[#635F59]">Memuat artikel...</p>}
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{(data ?? []).map((article) => <article key={article.id} className="overflow-hidden rounded-2xl border border-[#E8DFC8] bg-white"><>{article.cover_url && <img src={article.cover_url} alt="" className="aspect-[16/9] w-full object-cover" />}</><div className="p-5"><p className="text-xs font-semibold uppercase text-[#C05621]">{article.language}</p><h2 className="mt-2 font-heading text-xl font-bold">{article.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#635F59]">{article.excerpt}</p><Link to={`/artikel/${article.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C05621]">Baca artikel <ArrowRight className="size-4" /></Link></div></article>)}</div>
        {!isLoading && !data?.length && <div className="mt-10 rounded-2xl border border-dashed border-[#E8DFC8] bg-white p-10 text-center text-sm text-[#635F59]"><BookOpen className="mx-auto mb-3 size-7 text-[#DD6B20]" />Artikel sedang disiapkan.</div>}
      </main><Footer />
    </div>
  );
}
