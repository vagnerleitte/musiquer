import type { Music } from "../types/music";

type MusicCardProps = {
  albumName?: string;
  music: Music;
  onDelete: (id: string) => void;
};

export function MusicCard({ albumName, music, onDelete }: MusicCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-950">{music.name}</h4>
          <p className="mt-1 text-sm text-slate-400">{music.artist}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-300">{albumName ?? "Sem álbum"}</p>
        </div>
        <button
          className="grid h-9 w-9 place-items-center rounded-full bg-rose-50 text-lg font-bold text-rose-300 hover:bg-rose-100"
          data-testid="delete-button"
          type="button"
          onClick={() => onDelete(music.id)}
        >
          ×
        </button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-300">Ano</p>
          <p className="mt-1 font-semibold text-slate-800">{music.year}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-300">Duração</p>
          <p className="mt-1 font-semibold text-slate-800">{music.duration}</p>
        </div>
      </div>
    </article>
  );
}
