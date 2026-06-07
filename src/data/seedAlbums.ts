import albumData from "../../coldplay-albums.json";
import type { Album } from "../types/music";

type AudioDbAlbum = {
  idAlbum?: string;
  strAlbum?: string;
  strArtist?: string;
  strAlbumThumb?: string;
  intYearReleased?: string;
};

export const seedAlbums: Album[] = ((albumData.album ?? []) as AudioDbAlbum[])
  .filter((album) => album.idAlbum && album.strAlbum && album.strArtist)
  .slice(0, 8)
  .map((album) => ({
    id: `album-${album.idAlbum}`,
    coverUrl: `/album-covers/album-${album.idAlbum}.jpg`,
    name: album.strAlbum ?? "Untitled album",
    artist: album.strArtist ?? "Unknown artist",
    year: Number(album.intYearReleased) || 2000,
  }));
