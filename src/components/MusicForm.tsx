import { FormEvent, useState } from "react";
import type { Album, Music } from "../types/music";

type MusicFormProps = {
  albums: Album[];
  onCancel: () => void;
  onSave: (music: Omit<Music, "id">) => void;
};

const initialFormValue: Omit<Music, "id"> = {
  albumId: "",
  name: "",
  artist: "",
  year: new Date().getFullYear(),
  duration: "",
};

export function MusicForm({ albums, onCancel, onSave }: MusicFormProps) {
  const [formValue, setFormValue] = useState(initialFormValue);
  const [nameHasError, setNameHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formValue.name.trim()) {
      setNameHasError(true);
      return;
    }

    onSave({
      albumId: formValue.albumId || albums[0]?.id || "",
      name: formValue.name.trim(),
      artist: formValue.artist.trim(),
      year: Number(formValue.year),
      duration: formValue.duration.trim(),
    });
  }

  return (
    <form
      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      data-testid="music-form"
      onSubmit={handleSubmit}
    >
      <h4 className="mb-6 text-xl font-semibold text-slate-950">Nova música</h4>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input
            className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-300 ${
              nameHasError ? "validation-color-only" : ""
            }`}
            placeholder="Nome da música ou álbum"
            value={formValue.name}
            onChange={(event) => {
              setFormValue({ ...formValue, name: event.target.value });
              setNameHasError(false);
            }}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="album">
            Álbum
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
            id="album"
            value={formValue.albumId}
            onChange={(event) => {
              const selectedAlbum = albums.find((album) => album.id === event.target.value);

              setFormValue({
                ...formValue,
                albumId: event.target.value,
                artist: selectedAlbum?.artist ?? formValue.artist,
                year: selectedAlbum?.year ?? formValue.year,
              });
            }}
          >
            <option value="">Selecione um álbum</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="artist">
            Artista
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
            id="artist"
            value={formValue.artist}
            onChange={(event) => setFormValue({ ...formValue, artist: event.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="year">
            Ano
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
            id="year"
            type="number"
            value={formValue.year}
            onChange={(event) => setFormValue({ ...formValue, year: Number(event.target.value) })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="duration">
            Duração
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
            id="duration"
            placeholder="Ex: 03:45"
            value={formValue.duration}
            onChange={(event) => setFormValue({ ...formValue, duration: event.target.value })}
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
        <button
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
          data-testid="save-button"
          type="submit"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
