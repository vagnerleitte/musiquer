import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { MusicCard } from "../components/MusicCard";
import { loadAlbums } from "../storage/albumStorage";
import { loadMusics, saveMusics } from "../storage/musicStorage";
import type { Album, Music } from "../types/music";

export function MusicListPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [musics, setMusics] = useState<Music[]>([]);

  useEffect(() => {
    setAlbums(loadAlbums());
    setMusics(loadMusics());
  }, []);

  function handleDelete(id: string) {
    const nextMusics = musics.filter((music) => music.id !== id);
    setMusics(nextMusics);
    saveMusics(nextMusics);
  }

  return (
    <AppLayout>
      <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Músicas cadastradas</h2>
          <p className="mt-1 text-sm text-slate-400">Dados locais baseados no catálogo do Coldplay.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            to="/albums"
          >
            Ver Álbuns
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
            data-testid="create-music-button"
            to="/new"
          >
            Adicionar Música
          </Link>
        </div>
      </section>

      {musics.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h4 className="text-xl font-semibold text-slate-900">Nenhuma música cadastrada</h4>
          <p className="mt-2 text-slate-400">Adicione uma música para iniciar o catálogo local.</p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="music-list">
          {musics.map((music) => (
            <MusicCard
              albumName={albums.find((album) => album.id === music.albumId)?.name}
              key={music.id}
              music={music}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </AppLayout>
  );
}
