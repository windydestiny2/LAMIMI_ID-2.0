export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidWhatsAppPhone(value: string) {
  const s = value.trim();
  if (!s) return false;

  // Accept Indonesia-style numbers like 08... or +62..., and reject obvious garbage.
  const normalized = s.replace(/\s|-/g, '');
  const inbound = /^\+?62\d{8,14}$/.test(normalized);
  const local = /^08\d{8,13}$/.test(normalized);
  return inbound || local;
}

export function billableWeightKg(totalWeightGrams: number) {
  return Math.max(1, Math.ceil((Math.max(0, totalWeightGrams) - 300) / 1000));
}

export function hasPhysicalItems(items: Array<{ type: string }>) {
  return items.some((item) => item.type === 'fisik');
}

export function validateCheckoutContact(form: { email: string; phone: string; isPhysical: boolean }) {
  if (!form.phone.trim() || !isValidWhatsAppPhone(form.phone)) {
    return 'Nomor WhatsApp harus berupa nomor WhatsApp yang benar.';
  }

  if (!form.email.trim()) {
    return form.isPhysical ? 'Isi email agar notifikasi pesanan bisa dikirim.' : 'Isi email untuk pengiriman ebook ya.';
  }

  if (!isValidEmail(form.email)) {
    return form.isPhysical ? 'Email harus benar agar notifikasi pesanan bisa dikirim.' : 'Email harus benar agar ebook bisa dikirim.';
  }

  return '';
}
