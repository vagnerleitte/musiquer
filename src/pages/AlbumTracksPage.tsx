import { Link, useParams } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { loadAlbums } from "../storage/albumStorage";
import { loadMusics } from "../storage/musicStorage";

export function AlbumTracksPage() {
  const { albumId = "" } = useParams();
  const album = loadAlbums().find((item) => item.id === albumId);
  const tracks = loadMusics().filter((music) => music.albumId === albumId);

  return (
    <AppLayout>
      <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {album?.coverUrl ? (
            <img className="h-28 w-28 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200" src={album.coverUrl} />
          ) : null}
          <div>
            <Link className="text-sm font-semibold text-indigo-500 hover:text-indigo-700" to="/">
              Voltar para álbuns
            </Link>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              {album?.name ?? "Selecione um álbum"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {album ? `${album.artist} • ${album.year} • ${tracks.length} músicas` : "Volte para a home e escolha um card"}
            </p>
          </div>
        </div>
        {album ? (
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
            data-testid="create-music-button"
            to="/new"
          >
            Adicionar Música
          </Link>
        ) : null}
      </section>

      {!album ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h4 className="text-xl font-semibold text-slate-900">Nenhum álbum selecionado</h4>
          <p className="mt-2 text-slate-400">A tela inicial agora mostra os álbuns disponíveis.</p>
          <Link
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
            to="/"
          >
            Ir para álbuns
          </Link>
        </section>
      ) : tracks.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h4 className="text-xl font-semibold text-slate-900">Nenhuma música encontrada para este álbum</h4>
          <p className="mt-2 text-slate-400">Os cadastros manuais não possuem faixas importadas no JSON local.</p>
        </section>
      ) : (
        <section
          className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
          data-testid="music-list"
        >
          <div className="hidden grid-cols-[72px_1fr_120px] gap-4 border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-300 sm:grid">
            <span>#</span>
            <span>Música</span>
            <span>Duração</span>
          </div>
          {tracks.map((track, index) => (
            <article
              className="grid grid-cols-[48px_1fr] gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:grid-cols-[72px_1fr_120px] sm:gap-4"
              data-testid="album-track"
              key={track.id}
            >
              <span className="font-semibold text-slate-300">{index + 1}</span>
              <h4 className="font-semibold text-slate-950">{track.name}</h4>
              <span className="col-start-2 text-sm text-slate-400 sm:col-start-auto">{track.duration}</span>
            </article>
          ))}
        </section>
      )}
    </AppLayout>
  );
}
