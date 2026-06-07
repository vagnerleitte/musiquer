import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { MusicForm } from "../components/MusicForm";
import { loadAlbums } from "../storage/albumStorage";
import { loadMusics, saveMusics } from "../storage/musicStorage";
import type { Music } from "../types/music";

function createMusicId() {
  return `music-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CreateMusicPage() {
  const navigate = useNavigate();
  const albums = loadAlbums();

  function handleSave(musicValue: Omit<Music, "id">) {
    const nextMusics = [{ ...musicValue, id: createMusicId() }, ...loadMusics()];
    saveMusics(nextMusics);
    navigate(`/albums/${musicValue.albumId}`);
  }

  return (
    <AppLayout>
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-slate-950">Cadastrar música</h2>
        <p className="mt-1 text-sm text-slate-400">Preencha as informações básicas do item musical.</p>
      </section>

      <MusicForm albums={albums} onCancel={() => navigate("/")} onSave={handleSave} />
    </AppLayout>
  );
}
