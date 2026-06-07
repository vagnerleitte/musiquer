import trackData from "../../coldplay-tracks.json";
import type { Music } from "../types/music";

type AudioDbTrack = {
  idTrack?: string;
  idAlbum?: string;
  strTrack?: string;
  strArtist?: string;
  intDuration?: string;
};

type AudioDbAlbumTracks = {
  albumId: string;
  tracks: AudioDbTrack[];
};

function formatDuration(duration?: string) {
  const durationMs = Number(duration);

  if (!durationMs) {
    return "--:--";
  }

  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const seedMusics: Music[] = ((trackData.albums ?? []) as AudioDbAlbumTracks[]).flatMap((album) =>
  album.tracks.map((track, index) => ({
    id: track.idTrack ?? `track-${album.albumId}-${index}`,
    albumId: `album-${album.albumId}`,
    name: track.strTrack ?? "Untitled track",
    artist: track.strArtist ?? "Coldplay",
    year: 2000,
    duration: formatDuration(track.intDuration),
  }))
);
