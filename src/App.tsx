import { Navigate, Route, Routes } from "react-router-dom";
import { AlbumListPage } from "./pages/AlbumListPage";
import { AlbumTracksPage } from "./pages/AlbumTracksPage";
import { CreateAlbumPage } from "./pages/CreateAlbumPage";
import { CreateMusicPage } from "./pages/CreateMusicPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AlbumListPage />} />
      <Route path="/new" element={<CreateMusicPage />} />
      <Route path="/albums/new" element={<CreateAlbumPage />} />
      <Route path="/albums/:albumId" element={<AlbumTracksPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
