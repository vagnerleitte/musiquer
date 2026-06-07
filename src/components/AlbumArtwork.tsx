type AlbumArtworkProps = {
  coverUrl?: string;
  size: "card" | "detail";
};

const placeholderCoverUrl = "/album-covers/cover-placeholder.png";

export function AlbumArtwork({ coverUrl, size }: AlbumArtworkProps) {
  const className =
    size === "card"
      ? "h-full w-full object-cover"
      : "h-28 w-28 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200";

  if (coverUrl) {
    return <img className={className} src={coverUrl} />;
  }

  return <img className={className} data-testid="album-cover-placeholder" src={placeholderCoverUrl} />;
}
