import { useState } from "react";
import { MessageCircle, PackageSearch, Search, Star } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import type { OrderResponse, Review } from "@/lib/types";
import { formatDate, ORDER_STATUS, rupiah } from "@/lib/format";
import { apiErrorMessage } from "@/lib/adminApi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/Reveal";

export default function TrackOrder() {
  const [num, setNum] = useState("");
  const [result, setResult] = useState<OrderResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ email: "", book_id: "", rating: 5, comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const search = async () => {
    if (!num.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const orderResult = await apiGet<OrderResponse>(`/orders/${num.trim()}`);
      setResult(orderResult);
      setReviewForm((form) => ({ ...form, book_id: orderResult.order.items[0]?.book_id ?? "" }));
    } catch (e) {
      setError(apiErrorMessage(e) === "Terjadi kesalahan. Coba lagi ya." ? "Pesanan tidak ditemukan. Periksa kembali nomornya ya." : apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const status = result ? ORDER_STATUS[result.order.status] : null;

  const submitReview = async () => {
    if (!result || !reviewForm.email.trim() || !reviewForm.book_id) return;
    setReviewLoading(true);
    setReviewMessage("");
    try {
      await apiPost<Review>("/reviews", {
        order_number: result.order.order_number,
        customer_email: reviewForm.email,
        book_id: reviewForm.book_id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewMessage("Review terkirim dan menunggu moderasi admin. Terima kasih!");
    } catch (e) {
      setReviewMessage(apiErrorMessage(e));
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DD6B20]">Lacak Pesanan</p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Di mana pesananku sekarang?</h1>
          <p className="mt-3 text-base text-[#635F59]">Masukkan nomor pesanan (contoh: LM-AB12CD) yang kamu dapat setelah checkout.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex gap-2">
            <Input
              value={num}
              onChange={(e) => setNum(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="LM-XXXXXX"
              data-testid="track-order-input"
              className="h-12 font-mono"
            />
            <button
              onClick={search}
              disabled={loading}
              data-testid="track-order-button"
              className="inline-flex items-center gap-2 rounded-full bg-[#DD6B20] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#C05621] disabled:opacity-60"
            >
              <Search className="size-4" /> Lacak
            </button>
          </div>
        </Reveal>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700" data-testid="track-error">{error}</div>
        )}

        {result && status && (
          <Reveal className="mt-8">
            <div className="rounded-3xl border border-[#E8DFC8] bg-white p-6 sm:p-8" data-testid="track-result">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-lg font-bold" data-testid="track-order-number">{result.order.order_number}</p>
                  <p className="text-xs text-[#635F59]">{formatDate(result.order.created_at)}</p>
                </div>
                <span className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${status.cls}`} data-testid="track-status">{status.label}</span>
              </div>
              <div className="mt-5 space-y-2 border-t border-[#E8DFC8] pt-5 text-sm">
                {result.order.items.map((i) => (
                  <div key={i.book_id} className="flex justify-between"><span>{i.title} x{i.qty}</span><span className="font-mono">{rupiah(i.price)}</span></div>
                ))}
                {result.order.order_type === "fisik" && (
                  <div className="flex justify-between text-[#635F59]"><span>Ongkir JNE ({result.order.region})</span><span className="font-mono">{rupiah(result.order.shipping_cost)}</span></div>
                )}
                <div className="flex justify-between border-t border-[#E8DFC8] pt-2 font-mono font-bold text-[#9C4221]"><span>Total</span><span>{rupiah(result.order.total)}</span></div>
              </div>
              {result.order.order_type === "fisik" && result.order.address && (
                <p className="mt-4 rounded-xl bg-[#F5EDE0] p-3.5 text-xs leading-relaxed text-[#635F59]">
                  Dikirim ke: {result.order.address}, {result.order.city}, {result.order.province} {result.order.postal_code}
                </p>
              )}
              <a href={result.whatsapp_url} target="_blank" rel="noreferrer" data-testid="track-whatsapp-button" className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                <MessageCircle className="size-4" /> Hubungi Admin
                <PackageSearch className="hidden" />
              </a>
              {result.order.status === "selesai" && (
                <div className="mt-6 border-t border-[#E8DFC8] pt-6">
                  <h2 className="font-heading text-lg font-bold">Bagikan pengalaman belajarmu</h2>
                  <p className="mt-1 text-sm text-[#635F59]">Review akan tampil setelah disetujui admin.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Input value={reviewForm.email} onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })} placeholder="Email saat checkout" type="email" />
                    <select value={reviewForm.book_id} onChange={(e) => setReviewForm({ ...reviewForm, book_id: e.target.value })} className="h-10 rounded-md border border-[#E8DFC8] bg-white px-3 text-sm">
                      {result.order.items.map((item, index) => <option key={`${item.book_id}-${item.variant_id}-${index}`} value={item.book_id}>{item.title}{item.variant_label ? ` — ${item.variant_label}` : ""}{item.qty > 1 ? ` x${item.qty}` : ""}</option>)}
                    </select>
                  </div>
                  <div className="mt-3 flex items-center gap-1" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: value })} aria-label={`${value} bintang`} className={value <= reviewForm.rating ? "text-amber-500" : "text-[#D6D3D1]"}><Star className="size-5 fill-current" /></button>)}
                  </div>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Tulis review singkat (opsional)" className="mt-3 min-h-24 w-full rounded-md border border-[#E8DFC8] bg-white p-3 text-sm" />
                  <button onClick={submitReview} disabled={reviewLoading || !reviewForm.email.trim()} className="mt-3 rounded-full bg-[#DD6B20] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{reviewLoading ? "Mengirim..." : "Kirim review"}</button>
                  {reviewMessage && <p className="mt-3 text-sm text-[#635F59]">{reviewMessage}</p>}
                </div>
              )}
            </div>
          </Reveal>
        )}
      </section>
      <Footer />
    </div>
  );
}
