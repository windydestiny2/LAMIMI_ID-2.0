import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { customerLogin, customerSignup } from "@/lib/customer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const detail = (error.body as { detail?: unknown } | null)?.detail;
    if (typeof detail === "string") return detail;
  }
  return "Terjadi kesalahan. Coba lagi.";
}

export default function CustomerAuth({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const isSignup = mode === "signup";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      if (isSignup) await customerSignup(name, email, password);
      else await customerLogin(email, password);
      toast.success(isSignup ? "Akun berhasil dibuat" : "Berhasil masuk");
      navigate((location.state as { from?: string } | null)?.from ?? "/akun", { replace: true });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setPending(false);
    }
  };

  return <div className="min-h-screen bg-[#FAF7F2]"><Navbar /><main className="mx-auto max-w-md px-4 py-16 sm:px-6"><div className="rounded-3xl border border-[#E8DFC8] bg-white p-7 shadow-sm"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#FEEBC8] text-[#C05621]"><UserRound className="size-6" /></div><h1 className="mt-5 font-heading text-3xl font-bold">{isSignup ? "Buat akun customer" : "Masuk ke akun"}</h1><p className="mt-2 text-sm text-[#635F59]">Simpan wishlist, keranjang, dan data checkout di semua perangkat.</p><form onSubmit={submit} className="mt-7 space-y-4">{isSignup && <div><label className="text-sm font-medium">Nama lengkap</label><Input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>}<div><label className="text-sm font-medium">Email</label><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div><div><label className="text-sm font-medium">Password</label><Input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /><p className="mt-1 text-xs text-[#635F59]">Minimal 8 karakter.</p></div><button disabled={pending} className="w-full rounded-full bg-[#DD6B20] py-3 text-sm font-semibold text-white hover:bg-[#C05621] disabled:opacity-50">{pending ? "Memproses..." : isSignup ? "Daftar" : "Masuk"}</button></form><p className="mt-6 text-center text-sm text-[#635F59]">{isSignup ? "Sudah punya akun?" : "Belum punya akun?"} <Link to={isSignup ? "/masuk" : "/daftar"} className="font-semibold text-[#C05621]">{isSignup ? "Masuk" : "Daftar"}</Link></p></div></main><Footer /></div>;
}
