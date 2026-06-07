import { readdir } from "node:fs/promises";

async function countFiles(directory, extension) {
  try {
    const files = await readdir(directory);
    return files.filter((file) => file.endsWith(extension)).length;
  } catch {
    return 0;
  }
}

const screenshots = await countFiles("artifacts/screenshots", ".png");
const dom = await countFiles("artifacts/dom", ".html");
const accessibility = await countFiles("artifacts/accessibility", ".json");
const axe = await countFiles("artifacts/axe", ".json");

console.log("Argus artifacts generated:");
console.log(`- Screenshots: ${screenshots}`);
console.log(`- DOM snapshots: ${dom}`);
console.log(`- Accessibility trees: ${accessibility}`);
console.log(`- Axe results: ${axe}`);
