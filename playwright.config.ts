import { defineConfig, devices } from "@playwright/test";

const targetUrl = process.env.ARGUS_TARGET_URL ?? "https://musiquer.vercel.app";
const shouldStartLocalServer = targetUrl.includes("127.0.0.1") || targetUrl.includes("localhost");

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  outputDir: "test-results",
  use: {
    baseURL: targetUrl,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: shouldStartLocalServer
    ? {
        command: "npm run dev",
        url: targetUrl,
        reuseExistingServer: true,
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
