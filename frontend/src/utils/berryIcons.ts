import L from "leaflet";
import type { BerryType } from "../types";

const blueberrySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
  <path d="M20 48 C20 48 4 30 4 18 C4 9.2 11.2 2 20 2 C28.8 2 36 9.2 36 18 C36 30 20 48 20 48Z" fill="#1B6B3A" stroke="#fff" stroke-width="2"/>
  <circle cx="20" cy="18" r="10" fill="#3949AB"/>
  <circle cx="16" cy="14" r="2" fill="#5C6BC0" opacity="0.7"/>
  <circle cx="23" cy="16" r="1.5" fill="#5C6BC0" opacity="0.7"/>
  <circle cx="18" cy="20" r="1.5" fill="#5C6BC0" opacity="0.5"/>
  <path d="M17 9 L20 6 L23 9" fill="none" stroke="#2E7D32" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const lingonberrySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
  <path d="M20 48 C20 48 4 30 4 18 C4 9.2 11.2 2 20 2 C28.8 2 36 9.2 36 18 C36 30 20 48 20 48Z" fill="#1B6B3A" stroke="#fff" stroke-width="2"/>
  <circle cx="20" cy="18" r="10" fill="#C62828"/>
  <circle cx="16" cy="15" r="3" fill="#E53935"/>
  <circle cx="23" cy="15" r="3" fill="#E53935"/>
  <circle cx="20" cy="21" r="3" fill="#E53935"/>
  <circle cx="15" cy="14" r="1" fill="#EF9A9A" opacity="0.6"/>
  <circle cx="22" cy="14" r="1" fill="#EF9A9A" opacity="0.6"/>
  <path d="M17 9 L20 6 L23 9" fill="none" stroke="#2E7D32" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

function createSvgIcon(svg: string): L.Icon {
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [36, 45],
    iconAnchor: [18, 45],
    popupAnchor: [0, -45],
  });
}

export const berryIcons: Record<BerryType, L.Icon> = {
  blueberry: createSvgIcon(blueberrySvg),
  lingonberry: createSvgIcon(lingonberrySvg),
};

export const berryLabels: Record<BerryType, string> = {
  blueberry: "Mustikka",
  lingonberry: "Puolukka",
};

export const berryColors: Record<BerryType, string> = {
  blueberry: "#3949AB",
  lingonberry: "#C62828",
};
