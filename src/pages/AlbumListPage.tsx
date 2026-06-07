import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { loadAlbums, saveAlbums } from "../storage/albumStorage";
import type { Album } from "../types/music";

export function AlbumListPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumFilter, setAlbumFilter] = useState("");
  const filteredAlbums = albums.filter((album) => album.name.toLowerCase().includes(albumFilter.toLowerCase()));

  useEffect(() => {
    setAlbums(loadAlbums());
  }, []);

  function handleDelete(id: string) {
    const nextAlbums = albums.filter((album) => album.id !== id);
    setAlbums(nextAlbums);
    saveAlbums(nextAlbums);
  }

  return (
    <AppLayout>
      <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Álbuns cadastrados</h2>
          <p className="mt-1 text-sm text-slate-400">Escolha um álbum para ver apenas as músicas dele.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm placeholder:text-slate-300"
            placeholder="Filtrar álbum"
            value={albumFilter}
            onChange={(event) => setAlbumFilter(event.target.value)}
          />
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-sm hover:bg-indigo-700"
            to="/albums/new"
          >
            Adicionar Álbum
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlbums.map((album) => (
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" key={album.id}>
            <div className="aspect-square bg-slate-100">
              {album.coverUrl ? (
                <img className="h-full w-full object-cover" src={album.coverUrl} />
              ) : (
                <div className="grid h-full place-items-center text-sm font-semibold text-slate-300">Sem capa</div>
              )}
            </div>
            <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-950">{album.name}</h4>
                <p className="mt-1 text-sm text-slate-400">{album.artist}</p>
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-full bg-rose-50 text-lg font-bold text-rose-300 hover:bg-rose-100"
                data-testid="delete-button"
                type="button"
                onClick={() => handleDelete(album.id)}
              >
                ×
              </button>
            </div>
            <p className="mt-5 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-800">{album.year}</p>
            <Link
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              to={`/albums/${album.id}`}
            >
              Ver músicas do álbum
            </Link>
            </div>
          </article>
        ))}
      </section>
    </AppLayout>
  );
}
