import trackData from "../../coldplay-tracks.json";
import type { AlbumTrack } from "../types/music";

type AudioDbTrack = {
  idTrack?: string;
  strTrack?: string;
  intDuration?: string;
  intTrackNumber?: string;
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

export function getTracksByAlbumId(albumId?: string): AlbumTrack[] {
  if (!albumId) {
    return [];
  }

  const album = (trackData.albums as AudioDbAlbumTracks[]).find((item) => item.albumId === albumId);

  if (!album) {
    return [];
  }

  return album.tracks.map((track, index) => ({
    id: track.idTrack ?? `${albumId}-${index}`,
    name: track.strTrack ?? "Untitled track",
    duration: formatDuration(track.intDuration),
    position: Number(track.intTrackNumber) || index + 1,
  }));
}
