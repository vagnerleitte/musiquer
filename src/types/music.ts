export type Album = {
  id: string;
  coverUrl?: string;
  name: string;
  artist: string;
  year: number;
};

export type Music = {
  id: string;
  albumId: string;
  name: string;
  artist: string;
  year: number;
  duration: string;
};

export type AlbumTrack = {
  id: string;
  name: string;
  duration: string;
  position: number;
};
