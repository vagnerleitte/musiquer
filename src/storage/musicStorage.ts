import { seedMusics } from "../data/seedMusics";
import type { Music } from "../types/music";

export const MUSIC_STORAGE_KEY = "argus-demo:musics";

export function loadMusics(): Music[] {
  const storedValue = window.localStorage.getItem(MUSIC_STORAGE_KEY);

  if (!storedValue) {
    saveMusics(seedMusics);
    return seedMusics;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      saveMusics(seedMusics);
      return seedMusics;
    }

    const looksLikeOldAlbumSeed = parsedValue.length > 0 && parsedValue.every((music) => String(music.id).startsWith("album-"));

    if (looksLikeOldAlbumSeed) {
      saveMusics(seedMusics);
      return seedMusics;
    }

    return parsedValue.map((music) => ({
      ...music,
      albumId:
        typeof music.albumId === "string" && music.albumId.startsWith("album-")
          ? music.albumId
          : `album-${music.albumId}`,
    }));
  } catch {
    saveMusics(seedMusics);
    return seedMusics;
  }
}

export function saveMusics(musics: Music[]) {
  window.localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(musics));
}
