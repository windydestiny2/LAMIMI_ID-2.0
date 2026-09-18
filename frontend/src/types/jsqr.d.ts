declare module "jsqr" {
  interface QRCodeResult {
    data: string;
  }

  export default function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
  ): QRCodeResult | null;
}

declare module "qris-dinamis" {
  export interface ValidationResult {
    valid: boolean;
    errors: string[];
  }

  export function validateQRIS(qrisString: string): ValidationResult;
  export function convertQRIS(qrisString: string, options: { amount: number; fee?: { type: "fixed" | "percentage"; value: number } }): string;
}