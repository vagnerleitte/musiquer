import { useNavigate } from "react-router-dom";
import { AlbumForm } from "../components/AlbumForm";
import { AppLayout } from "../components/AppLayout";
import { loadAlbums, saveAlbums } from "../storage/albumStorage";
import type { Album } from "../types/music";

function createAlbumId() {
  return `album-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CreateAlbumPage() {
  const navigate = useNavigate();

  function handleSave(albumValue: Omit<Album, "id">) {
    saveAlbums([{ ...albumValue, id: createAlbumId() }, ...loadAlbums()]);
    navigate("/");
  }

  return (
    <AppLayout>
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-slate-950">Cadastrar álbum</h2>
        <p className="mt-1 text-sm text-slate-400">Depois ele aparece no select do cadastro de música.</p>
      </section>

      <AlbumForm onCancel={() => navigate("/")} onSave={handleSave} />
    </AppLayout>
  );
}
