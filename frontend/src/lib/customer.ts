import { apiGet, apiPost, apiPut } from "@/lib/api";
import { getCart, replaceCart } from "@/lib/cart";
import { getWishlist, replaceWishlist } from "@/lib/wishlist";

export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  role: "customer";
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  wishlist: string[];
  cart: ReturnType<typeof getCart>;
}

export async function getCustomerProfile(): Promise<CustomerProfile> {
  return apiGet<CustomerProfile>("/customer/me");
}

export async function syncCustomerData() {
  return apiPut<{ ok: boolean }>("/customer/sync", {
    wishlist: getWishlist(),
    cart: getCart(),
  });
}

export async function customerLogin(email: string, password: string) {
  await apiPost<{ user: CustomerProfile }>("/auth/customer-login", { email, password });
  await mergeCustomerData();
  const result = await getCustomerProfile();
  return result;
}

export async function customerSignup(name: string, email: string, password: string) {
  await apiPost<{ user: CustomerProfile }>("/auth/signup", { name, email, password });
  await mergeCustomerData();
  const result = await getCustomerProfile();
  return result;
}

async function mergeCustomerData() {
  const remote = await getCustomerProfile();
  const wishlist = [...new Set([...remote.wishlist, ...getWishlist()])];
  const localCart = getCart();
  const cart = [...remote.cart];
  for (const item of localCart) {
    const existing = cart.find((entry) => entry.key === item.key);
    if (existing) existing.qty += item.qty;
    else cart.push(item);
  }
  replaceWishlist(wishlist);
  replaceCart(cart);
  await apiPut("/customer/sync", { wishlist, cart });
}

export async function saveCustomerProfile(profile: Pick<CustomerProfile, "name" | "phone" | "address" | "city" | "province" | "postal_code">) {
  return apiPut<CustomerProfile>("/customer/profile", profile);
}
