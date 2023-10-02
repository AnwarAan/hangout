import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatToUnits(number, precision) {
  const abbrev = ["", "K", "M", "B", "T"];
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(number)) / 3);
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1));
  const suffix = abbrev[order];
  return (number / Math.pow(10, order * 3)).toFixed(1) + suffix;
}

export function FormatToIDR(price) {
  return new Intl.NumberFormat("ID", { style: "currency", currency: "IDR" }).format(price);
}

export function IsObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
