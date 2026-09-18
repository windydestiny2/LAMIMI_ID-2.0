import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ExternalLink, Loader2, MessageCircle, Quote, Star, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiGet } from "@/lib/api";

interface ChinaNewsArticle {
  title: string;
  description: string;
  url: string;
  url_to_image: string;
  source: string;
  published_at: string;
}

interface ChinaNewsResponse {
  articles: ChinaNewsArticle[];
}

const NEWS_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
const REVIEW_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80";

const REVIEW_PHOTOS = [
  {
    name: "aszall_97",
    title: "Pembeli LAMIMI_ID",
    image: "",
    quote: "Gambar bagus. audio jernih, dapet bonus juga, terima kasih seller 👍🏻",
  },
  {
    name: "ratna_enjia",
    title: "Pembeli LAMIMI_ID",
    image: "",
    quote: "Semuanya bagus ya, no minus. Seller juga ramah. Kalau ada update pasti dikabari. Mantap, terima kasih seller 🙏🏻 Sukses selalu, ditunggu update selanjutnya ❤️",
  },
  {
    name: "vina_saja",
    title: "Pembeli Ebook",
    image: "",
    quote: "Terbaique, sepadan banget, belajar Mandarin bisa di mana saja dan kapan saja tanpa repot bawa buku fisik. Praktis, tersimpan di HP. Respon seller cepat, terpercaya, no tipu-tipu.",
  },
  {
    name: "Linda.boentaram",
    title: "Pembeli Buku Fisik",
    image: "",
    quote: "Cetakannya bagus banget dan jelas. Pengiriman juga gercep. Mantap... lain kali pesan lagi kalau sudah sampai HSK 2 🥰",
  },
  {
    name: "chysn.v",
    title: "Pembeli LAMIMI_ID",
    image: "",
    quote: "Produknya lengkap, bagus banget.",
  },
  {
    name: "allice_huang",
    title: "Pembeli Ebook",
    image: "",
    quote: "File PDF bagus dan rapi, sangat mudah menggunakannya. Tertata dengan urutan yang jelas. Sangat rekomendasi untuk beli di sini. Semoga tetap bagus dan terpercaya buat seller. Terima kasih.",
  },
];

export default function AboutUs() {
  const { data: news, isLoading: newsLoading, isError: newsError } = useQuery({
    queryKey: ["china-news"],
    queryFn: () => apiGet<ChinaNewsResponse>("/china-news"),
    staleTime: 15 * 60 * 1000,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1D1A]">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute left-0 top-20 h-52 w-52 rounded-full bg-[#FBD38D]/40 blur-3xl" />
        <div className="absolute right-0 top-60 h-72 w-72 rounded-full bg-[#DD6B20]/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center rounded-full border border-[#E8DFC8] bg-[#FFF8EE] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9C4221]">
              <BookOpen className="mr-2 size-4" /> LAMIMI_ID
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight text-[#1F1D1A] sm:text-5xl lg:text-6xl">
              Belajar bahasa mulai dari rak yang terasa dekat.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#635F59]">
              LAMIMI_ID adalah ruang belajar bahasa yang menggabungkan bahan bacaan yang rapi,
              buku yang bermanfaat, dan proses checkout yang terasa ringan untuk setiap pelajar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/etalase/digital" className="inline-flex items-center gap-2 rounded-full bg-[#DD6B20] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C05621]">
                Jelajahi Ebook <ArrowRight className="size-4" />
              </Link>
              <a href="https://wa.me/6285173290889" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#1F1D1A]/15 bg-white px-6 py-3 text-sm font-semibold text-[#1F1D1A] hover:border-[#DD6B20] hover:text-[#C05621]">
                <MessageCircle className="size-4" /> Chat Admin
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p className="font-mono text-3xl font-bold text-[#9C4221]">100+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#635F59]">Ebook</p>
              </div>
              <div>
                <p className="font-mono text-3xl font-bold text-[#9C4221]">04</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#635F59]">Bahasa</p>
              </div>
              <div>
                <p className="font-mono text-3xl font-bold text-[#9C4221]">24/7</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#635F59]">Support</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-5 rounded-[3rem] border border-[#E8DFC8] bg-[#F5EDE0]" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
                  alt="LAMIMI_ID"
                  className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
                />
              </div>
              <div className="absolute -left-3 top-8 rounded-2xl border border-[#E8DFC8] bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="size-4 fill-[#DD6B20] text-[#DD6B20]" />
                  <span className="font-heading text-xl font-bold text-[#9C4221]">5.0</span>
                </div>
                <p className="text-[11px] font-semibold text-[#635F59]">Rated by learners</p>
              </div>
              <div className="absolute -right-4 bottom-8 rounded-2xl border border-[#E8DFC8] bg-[#1F1D1A] px-4 py-3 text-white shadow-xl">
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-[#FBD38D]" />
                  <span className="text-xs font-semibold">Kirim cepat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E8DFC8] bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-[#E8DFC8] bg-[#FDF8EE] p-8">
              <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#DD6B20] text-white">
                <BookOpen className="size-5" />
              </span>
              <h3 className="font-heading text-2xl font-semibold text-[#1F1D1A]">Bahan yang terasa rapi</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#635F59]">
                Setiap judul dipilih untuk membuat belajar bahasa terasa fokus dan memiliki arah.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#E8DFC8] bg-[#FDF8EE] p-8">
              <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#DD6B20] text-white">
                <Truck className="size-5" />
              </span>
              <h3 className="font-heading text-2xl font-semibold text-[#1F1D1A]">Kirim instan & aman</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#635F59]">
                Ebook dikirim setelah pembayaran terverifikasi, dan buku fisik siap dikirim lewat JNE.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#E8DFC8] bg-[#FDF8EE] p-8">
              <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#DD6B20] text-white">
                <MessageCircle className="size-5" />
              </span>
              <h3 className="font-heading text-2xl font-semibold text-[#1F1D1A]">Komunitas yang hangat</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#635F59]">
                Komunikasi lewat WhatsApp membuat semua perjalanan belajar terasa lebih dekat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DD6B20]">Review Learners</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Komunitas LAMIMI_ID
              </h2>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-[#E8DFC8] bg-white px-4 py-2">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-[#DD6B20] text-[#DD6B20]" />)}
              <span className="ml-2 text-sm font-semibold text-[#635F59]">5.0</span>
            </div>
          </div>

          <div className="relative mt-8 flex overflow-hidden">
            <div className="animate-marquee flex min-w-max gap-5">
              {[...REVIEW_PHOTOS, ...REVIEW_PHOTOS].map((review, i) => (
                <article key={`${review.name}-${i}`} className="w-72 shrink-0 rounded-[2rem] border border-[#E8DFC8] bg-white p-4 shadow-sm">
                  <div className="overflow-hidden rounded-[1.5rem]">
                    <img
                      src={review.image || REVIEW_FALLBACK_IMAGE}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                      onError={(event) => {
                        if (event.currentTarget.src !== REVIEW_FALLBACK_IMAGE) event.currentTarget.src = REVIEW_FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className="size-4 fill-[#DD6B20] text-[#DD6B20]" />)}
                    </div>
                    <div className="mt-3 flex items-start gap-2">
                      <Quote className="mt-1 size-4 text-[#DD6B20]" />
                      <p className="text-sm leading-relaxed text-[#635F59]">“{review.quote}”</p>
                    </div>
                    <div className="mt-4 border-t border-[#E8DFC8] pt-3">
                      <p className="font-heading text-base font-bold text-[#1F1D1A]">{review.name}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#635F59]">{review.title}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8DFC8] bg-[#F5EDE0] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DD6B20]">China Today</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Berita terbaru dari China</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#635F59]">Ikuti kabar terbaru dari China sebagai teman belajar bahasa dan budaya.</p>
            </div>
            <span className="rounded-full border border-[#E8DFC8] bg-white px-4 py-2 text-xs font-semibold text-[#635F59]">Sumber: NewsAPI</span>
          </div>

          {newsLoading && (
            <div className="mt-8 flex items-center gap-2 text-sm text-[#635F59]" data-testid="china-news-loading">
              <Loader2 className="size-4 animate-spin text-[#DD6B20]" /> Memuat berita terbaru...
            </div>
          )}
          {newsError && <p className="mt-8 text-sm text-[#635F59]" data-testid="china-news-error">Berita sedang belum tersedia. Silakan coba lagi nanti.</p>}
          {!newsLoading && !newsError && news?.articles.length === 0 && <p className="mt-8 text-sm text-[#635F59]">Belum ada berita terbaru.</p>}

          {news?.articles && news.articles.length > 0 && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {news.articles.map((article) => (
                <article key={article.url} className="overflow-hidden rounded-[1.5rem] border border-[#E8DFC8] bg-white shadow-sm">
                  <img
                    src={article.url_to_image || NEWS_FALLBACK_IMAGE}
                    alt=""
                    className="aspect-[16/9] w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      if (event.currentTarget.src !== NEWS_FALLBACK_IMAGE) event.currentTarget.src = NEWS_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#DD6B20]">{article.source}</p>
                    <h3 className="mt-2 line-clamp-3 font-heading text-lg font-semibold leading-snug">{article.title}</h3>
                    {article.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#635F59]">{article.description}</p>}
                    <a href={article.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#9C4221] hover:text-[#C05621]">
                      Baca berita <ExternalLink className="size-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
