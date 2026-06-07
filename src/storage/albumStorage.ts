import { seedAlbums } from "../data/seedAlbums";
import type { Album } from "../types/music";

export const ALBUM_STORAGE_KEY = "argus-demo:albums";

function hydrateSeedCovers(albums: Album[]) {
  return albums.map((album) => {
    const seedAlbum = seedAlbums.find((seed) => seed.id === album.id);

    return seedAlbum ? { ...album, coverUrl: album.coverUrl ?? seedAlbum.coverUrl } : album;
  });
}

export function loadAlbums(): Album[] {
  const storedValue = window.localStorage.getItem(ALBUM_STORAGE_KEY);

  if (!storedValue) {
    saveAlbums(seedAlbums);
    return seedAlbums;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      saveAlbums(seedAlbums);
      return seedAlbums;
    }

    const hydratedValue = hydrateSeedCovers(parsedValue);
    saveAlbums(hydratedValue);

    return hydratedValue;
  } catch {
    saveAlbums(seedAlbums);
    return seedAlbums;
  }
}

export function saveAlbums(albums: Album[]) {
  window.localStorage.setItem(ALBUM_STORAGE_KEY, JSON.stringify(albums));
}
