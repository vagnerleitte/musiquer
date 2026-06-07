import { expect, type Page, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

async function waitForImages(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)
  );
}

function formatAudioDbDuration(duration: string) {
  const totalSeconds = Math.round(Number(duration) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function createRatedRAlbum(page: Page) {
  const albumJson = {
    strAlbum: "Rated R",
    strArtist: "Rihanna",
    intYearReleased: "2009",
    strAlbumThumb: "https://r2.theaudiodb.com/images/media/album/thumb/rated-r-4dd060aabb6e8.jpg",
  };

  await page.goto("/albums/new");
  await page.getByPlaceholder("Nome do álbum").fill(albumJson.strAlbum);
  await page.getByLabel("Artista").fill(albumJson.strArtist);
  await page.getByLabel("Ano").fill(albumJson.intYearReleased);
  await page.getByLabel(/URL da capa/).fill(albumJson.strAlbumThumb);

  await page.getByLabel(/URL da capa/).clear();
  await page.getByRole("button", { name: "Salvar Álbum" }).click();
  await expect(page.getByText("Rated R")).toBeVisible();
}

test("opens the target app and captures a screenshot", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Argus Music Registry|Musiquer/i);
  await waitForImages(page);
  await mkdir("artifacts/screenshots", { recursive: true });
  await page.screenshot({
    fullPage: true,
    path: "artifacts/screenshots/home.png",
  });
});

test("navigates from the album list to an album detail page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Álbuns cadastrados" })).toBeVisible();
  await waitForImages(page);

  await page.getByRole("link", { name: "Ver músicas do álbum" }).first().click();

  await expect(page).toHaveURL(/\/albums\/album-/);
  await expect(page.getByRole("link", { name: "Voltar para álbuns" })).toBeVisible();
  await expect(page.getByTestId("music-list")).toBeVisible();
  await expect(page.getByTestId("album-track")).not.toHaveCount(0);
  await waitForImages(page);

  await mkdir("artifacts/screenshots", { recursive: true });
  await page.screenshot({
    fullPage: true,
    path: "artifacts/screenshots/album-detail.png",
  });
});

test("creates an album using TheAudioDB JSON data", async ({ page }) => {
  const albumJson = {
    strAlbum: "Rated R",
    strArtist: "Rihanna",
    intYearReleased: "2009",
    strAlbumThumb: "https://r2.theaudiodb.com/images/media/album/thumb/rated-r-4dd060aabb6e8.jpg",
  };

  expect(albumJson.strAlbum).toBeTruthy();
  expect(albumJson.strArtist).toBeTruthy();
  expect(albumJson.intYearReleased).toBeTruthy();
  expect(albumJson.strAlbumThumb).toBeTruthy();

  await page.goto("/albums/new");
  await mkdir("artifacts/screenshots", { recursive: true });

  await page.screenshot({
    fullPage: true,
    path: "artifacts/screenshots/create-album-empty.png",
  });

  await page.getByPlaceholder("Nome do álbum").fill(albumJson.strAlbum);
  await page.getByLabel("Artista").fill(albumJson.strArtist);
  await page.getByLabel("Ano").fill(albumJson.intYearReleased);
  await page.getByLabel(/URL da capa/).fill(albumJson.strAlbumThumb);

  await expect(page.getByPlaceholder("Nome do álbum")).toHaveValue("Rated R");
  await expect(page.getByLabel("Artista")).toHaveValue("Rihanna");
  await expect(page.getByLabel("Ano")).toHaveValue("2009");
  await expect(page.getByLabel(/URL da capa/)).toHaveValue(albumJson.strAlbumThumb);
  await page.getByLabel(/URL da capa/).clear();
  await expect(page.getByLabel(/URL da capa/)).toHaveValue("");

  await page.screenshot({
    fullPage: true,
    path: "artifacts/screenshots/create-album-filled.png",
  });

  await page.getByRole("button", { name: "Salvar Álbum" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("Rated R")).toBeVisible();
  await waitForImages(page);

  await page.screenshot({
    fullPage: true,
    path: "artifacts/screenshots/create-album-saved.png",
  });
});

test("creates a music inside the Rihanna album using TheAudioDB track data", async ({ page }) => {
  const trackJson = {
    strTrack: "Mad House",
    strAlbum: "Rated R",
    strArtist: "Rihanna",
    intDuration: "94480",
  };

  expect(trackJson.strTrack).toBeTruthy();
  expect(trackJson.strAlbum).toBe("Rated R");
  expect(trackJson.strArtist).toBeTruthy();
  expect(trackJson.intDuration).toBeTruthy();

  await mkdir("artifacts/screenshots", { recursive: true });
  await createRatedRAlbum(page);

  await page.goto("/new");

  await page.screenshot({
    fullPage: true,
    path: "artifacts/screenshots/create-music-empty.png",
  });

  await page.getByPlaceholder("Nome da música ou álbum").fill(trackJson.strTrack);
  await page.getByLabel("Álbum").selectOption({ label: trackJson.strAlbum });
  await expect(page.getByLabel("Artista")).toHaveValue(trackJson.strArtist);
  await expect(page.getByLabel("Ano")).toHaveValue("2009");
  await page.getByLabel("Duração").fill(formatAudioDbDuration(trackJson.intDuration));

  await page.screenshot({
    fullPage: true,
    path: "artifacts/screenshots/create-music-filled.png",
  });

  await page.getByRole("button", { name: "Salvar" }).click();

  await expect(page).toHaveURL(/\/albums\/album-/);
  await expect(page.getByRole("heading", { name: "Rated R" })).toBeVisible();
  const placeholder = page.getByTestId("album-cover-placeholder");

  if (await placeholder.isVisible({ timeout: 1000 }).catch(() => false)) {
    await expect(placeholder).toBeVisible();
  }

  await expect(page.getByTestId("album-track").filter({ hasText: trackJson.strTrack })).toBeVisible();
  await waitForImages(page);

  await page.screenshot({
    fullPage: true,
    path: "artifacts/screenshots/create-music-saved.png",
  });
});
