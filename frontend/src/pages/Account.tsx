import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { getCustomerProfile, saveCustomerProfile, type CustomerProfile } from "@/lib/customer";
import { endSession } from "@/lib/session";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function message(error: unknown) { return error instanceof ApiError && typeof (error.body as { detail?: unknown } | null)?.detail === "string" ? String((error.body as { detail: string }).detail) : "Terjadi kesalahan. Coba lagi."; }

export default function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", province: "", postal_code: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { getCustomerProfile().then((data) => { setProfile(data); setForm({ name: data.name, phone: data.phone, address: data.address, city: data.city, province: data.province, postal_code: data.postal_code }); }).catch(() => navigate("/masuk", { replace: true })).finally(() => setLoading(false)); }, [navigate]);
  const save = async () => { setSaving(true); try { const data = await saveCustomerProfile(form); setProfile(data); toast.success("Profil dan alamat tersimpan"); } catch (error) { toast.error(message(error)); } finally { setSaving(false); } };
  if (loading) return <div className="min-h-screen bg-[#FAF7F2]"><Navbar /><main className="mx-auto max-w-2xl px-4 py-16">Memuat akun...</main></div>;
  if (!profile) return null;
  return <div className="min-h-screen bg-[#FAF7F2]"><Navbar /><main className="mx-auto max-w-3xl px-4 py-14 sm:px-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C05621]">Akun customer</p><h1 className="mt-3 font-heading text-4xl font-bold">Halo, {profile.name}</h1><p className="mt-2 text-sm text-[#635F59]">{profile.email}</p></div><button onClick={() => endSession("/")} className="inline-flex items-center gap-2 rounded-full border border-[#E8DFC8] bg-white px-4 py-2 text-sm font-semibold text-[#635F59]"><LogOut className="size-4" /> Keluar</button></div><div className="mt-8 rounded-3xl border border-[#E8DFC8] bg-white p-6"><div className="flex items-center gap-2 font-heading text-xl font-bold"><UserRound className="size-5 text-[#DD6B20]" /> Data checkout</div><p className="mt-2 text-sm text-[#635F59]">Data ini akan otomatis mengisi checkout saat Anda masuk.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><label className="text-sm font-medium">Nama lengkap</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div><div><label className="text-sm font-medium">No. WhatsApp</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" /></div><div className="sm:col-span-2"><label className="text-sm font-medium">Alamat lengkap</label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1.5" /></div><div><label className="text-sm font-medium">Kota / Kabupaten</label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1.5" /></div><div><label className="text-sm font-medium">Provinsi</label><Input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="mt-1.5" /></div><div><label className="text-sm font-medium">Kode pos</label><Input value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="mt-1.5" /></div></div><button onClick={save} disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#DD6B20] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><Save className="size-4" /> {saving ? "Menyimpan..." : "Simpan data"}</button></div><div className="mt-5 flex gap-3"><Link to="/wishlist" className="rounded-full border border-[#E8DFC8] bg-white px-4 py-2 text-sm font-semibold">Wishlist</Link><Link to="/checkout/keranjang" className="rounded-full border border-[#E8DFC8] bg-white px-4 py-2 text-sm font-semibold">Keranjang</Link></div></main><Footer /></div>;
}
