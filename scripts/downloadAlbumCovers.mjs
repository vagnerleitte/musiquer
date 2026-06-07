import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import albumData from "../coldplay-albums.json" with { type: "json" };

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const coversDir = join(projectRoot, "public", "album-covers");
const albums = albumData.album.slice(0, 8).filter((album) => album.idAlbum && album.strAlbumThumb);

await mkdir(coversDir, { recursive: true });

for (const album of albums) {
  const outputPath = join(coversDir, `album-${album.idAlbum}.jpg`);
  const response = await fetch(album.strAlbumThumb);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${album.strAlbumThumb}`);
  }

  await new Promise((resolve, reject) => {
    const fileStream = createWriteStream(outputPath);
    response.body.pipeTo(
      new WritableStream({
        write(chunk) {
          fileStream.write(chunk);
        },
        close() {
          fileStream.end(resolve);
        },
        abort(error) {
          fileStream.destroy();
          reject(error);
        },
      })
    ).catch(reject);
  });
}

console.log(`Downloaded ${albums.length} album covers to public/album-covers`);
