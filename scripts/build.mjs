import { execSync } from "child_process";
import fs from "fs";

const env = { ...process.env };

execSync("node scripts/generate-pwa-icons.mjs", { stdio: "inherit", env });

let buildOutput;
try {
  buildOutput = execSync("pnpm exec next build", {
    encoding: "utf8",
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (error) {
  const stdout = error.stdout?.toString() ?? "";
  const stderr = error.stderr?.toString() ?? "";
  fs.writeFileSync(".build-output.log", stdout + stderr);
  console.error(stdout);
  console.error(stderr);
  process.exit(error.status ?? 1);
}

fs.writeFileSync(".build-output.log", buildOutput);
console.log(buildOutput);

execSync("node scripts/generate-sw.mjs", { stdio: "inherit", env });
execSync("node scripts/verify-bundle-from-log.mjs", { stdio: "inherit", env });
