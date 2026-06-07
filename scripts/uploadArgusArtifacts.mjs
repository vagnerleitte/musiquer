import { ZipArchive } from "archiver";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const artifactsDir = "artifacts";
const outputDir = join(artifactsDir, "bundle");
const zipPath = join(outputDir, "argus-artifacts.zip");

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function resolveMetadata() {
  return {
    applicationId: requireEnv("ARGUS_APPLICATION_ID"),
    apiUrl: requireEnv("ARGUS_API_URL"),
    deploymentId:
      process.env.ARGUS_DEPLOYMENT_ID ??
      process.env.VERCEL_GIT_COMMIT_SHA ??
      "local-dev",
    executionId:
      process.env.ARGUS_EXECUTION_ID ??
      process.env.VERCEL_DEPLOYMENT_ID ??
      "local-dev",
  };
}

async function zipArtifacts() {
  await mkdir(outputDir, { recursive: true });

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);

    archive.glob("**/*", {
      cwd: artifactsDir,
      ignore: ["bundle/**", ".DS_Store"],
    });

    archive.finalize();
  });
}

async function createUploadForm(metadata) {
  const zipBuffer = await readFile(zipPath);
  const formData = new FormData();

  formData.append("applicationId", metadata.applicationId);
  formData.append("deploymentId", metadata.deploymentId);
  formData.append("executionId", metadata.executionId);
  formData.append("artifactsZip", new Blob([zipBuffer], { type: "application/zip" }), "argus-artifacts.zip");

  return formData;
}

async function uploadArtifacts(metadata) {
  const formData = await createUploadForm(metadata);
  const shouldMockUpload = process.env.ARGUS_MOCK_UPLOAD !== "false";

  if (shouldMockUpload) {
    const zipStats = await stat(zipPath);

    console.log("Argus upload mocked:");
    console.log(`- API URL: ${metadata.apiUrl}`);
    console.log(`- applicationId: ${metadata.applicationId}`);
    console.log(`- deploymentId: ${metadata.deploymentId}`);
    console.log(`- executionId: ${metadata.executionId}`);
    console.log(`- artifactsZip: ${zipPath} (${zipStats.size} bytes)`);
    console.log("- Set ARGUS_MOCK_UPLOAD=false to perform the real multipart/form-data POST.");
    return;
  }

  const response = await fetch(metadata.apiUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Argus upload failed with ${response.status}: ${responseText}`);
  }

  console.log(`Argus upload completed: ${response.status}`);
}

try {
  const metadata = resolveMetadata();

  await stat(artifactsDir);
  await zipArtifacts();
  await uploadArtifacts(metadata);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
