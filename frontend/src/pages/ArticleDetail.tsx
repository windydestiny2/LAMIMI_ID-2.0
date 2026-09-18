import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/lib/types";
import { apiGet } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ArticleDetail() {
  const { slug } = useParams();
  const { data: article, isLoading } = useQuery({ queryKey: ["article", slug], queryFn: () => apiGet<Article>(`/articles/${slug}`), enabled: !!slug, retry: false });
  return <div className="min-h-screen bg-[#FAF7F2]"><Navbar /><main className="mx-auto max-w-3xl px-4 py-14 sm:px-6"><Link to="/artikel" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#635F59] hover:text-[#C05621]"><ArrowLeft className="size-4" /> Semua artikel</Link>{isLoading && <p className="mt-10 text-sm text-[#635F59]">Memuat artikel...</p>}{article && <article className="mt-8">{article.cover_url && <img src={article.cover_url} alt="" className="mb-8 aspect-[16/7] w-full rounded-3xl object-cover" />}<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C05621]">{article.language}</p><h1 className="mt-3 font-heading text-4xl font-bold leading-tight">{article.title}</h1><p className="mt-4 text-lg leading-relaxed text-[#635F59]">{article.excerpt}</p><div className="mt-10 whitespace-pre-wrap text-base leading-8 text-[#1F1D1A]">{article.content}</div></article>}</main><Footer /></div>;
}
