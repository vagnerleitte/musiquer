import { FormEvent, useState } from "react";
import type { Album } from "../types/music";

type AlbumFormProps = {
  onCancel: () => void;
  onSave: (album: Omit<Album, "id">) => void;
};

export function AlbumForm({ onCancel, onSave }: AlbumFormProps) {
  const [album, setAlbum] = useState<Omit<Album, "id">>({
    coverUrl: "",
    name: "",
    artist: "",
    year: new Date().getFullYear(),
  });
  const [nameHasError, setNameHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!album.name.trim()) {
      setNameHasError(true);
      return;
    }

    onSave({
      coverUrl: album.coverUrl?.trim(),
      name: album.name.trim(),
      artist: album.artist.trim(),
      year: Number(album.year),
    });
  }

  return (
    <form className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" onSubmit={handleSubmit}>
      <h4 className="mb-6 text-xl font-semibold text-slate-950">Novo álbum</h4>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input
            className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-300 ${
              nameHasError ? "validation-color-only" : ""
            }`}
            placeholder="Nome do álbum"
            value={album.name}
            onChange={(event) => {
              setAlbum({ ...album, name: event.target.value });
              setNameHasError(false);
            }}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="album-cover">
            URL da capa
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-300"
            id="album-cover"
            placeholder="https://..."
            value={album.coverUrl}
            onChange={(event) => setAlbum({ ...album, coverUrl: event.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="album-artist">
            Artista
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
            id="album-artist"
            value={album.artist}
            onChange={(event) => setAlbum({ ...album, artist: event.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="album-year">
            Ano
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
            id="album-year"
            type="number"
            value={album.year}
            onChange={(event) => setAlbum({ ...album, year: Number(event.target.value) })}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700" type="submit">
          Salvar Álbum
        </button>
      </div>
    </form>
  );
}
