import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";

const apiBaseUrl = process.env.API_BASE_URL;
const zipPath = process.env.ZIP_PATH ?? "artifacts/bundle/argus-artifacts.zip";
const applicationName = process.env.APP_NAME ?? "DemoApp";
const applicationVersion = process.env.APP_VERSION ?? "1.0.0";
const applicationDescription = process.env.APP_DESCRIPTION ?? "Teste";

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!apiBaseUrl) {
  fail("Missing required environment variable: API_BASE_URL");
}

let zipStats;

try {
  zipStats = await stat(zipPath);
} catch {
  fail(`ZIP file not found: ${zipPath}`);
}

if (!zipStats.isFile()) {
  fail(`ZIP path is not a file: ${zipPath}`);
}

const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, "");
const uploadUrl = normalizedApiBaseUrl.endsWith("/applications")
  ? `${normalizedApiBaseUrl}/upload`
  : `${normalizedApiBaseUrl}/applications/upload`;
const zipBuffer = await readFile(zipPath);
const formData = new FormData();

formData.append("name", applicationName);
formData.append("version", applicationVersion);
formData.append("description", applicationDescription);
formData.append("file", new Blob([zipBuffer], { type: "application/zip" }), basename(zipPath));

let response;

try {
  response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });
} catch (error) {
  console.error(`Upload request failed: ${uploadUrl}`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const responseText = await response.text();
let responseBody;

try {
  responseBody = JSON.parse(responseText);
} catch {
  responseBody = responseText;
}

console.log(`Upload status: ${response.status}`);
console.log(JSON.stringify(responseBody, null, 2));

if (!response.ok) {
  process.exit(1);
}
