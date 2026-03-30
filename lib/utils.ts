import { InfoParam } from "@/lib/types";

export function getInfoParam(data: InfoParam) {
  const json = JSON.stringify(data);

  const bytes = new TextEncoder().encode(json);
  const binary = String.fromCharCode(...bytes);

  return btoa(binary);
}

export function parseInfoParam(info: string | null): InfoParam | null {
  if (!info) return null;

  try {
    const binary = atob(info);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json);
  } catch {
    return null;
  }
}
