/**
 * Renders PNG PWA icons from app/icon.svg into public/.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const svgPath = path.join("app", "icon.svg");
const publicDir = "public";

if (!fs.existsSync(svgPath)) {
  console.error("generate-pwa-icons: app/icon.svg not found");
  process.exit(1);
}

const svg = fs.readFileSync(svgPath);

async function writeIcon(size, filename) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, filename));
  console.log(`generate-pwa-icons: ${filename} (${size}x${size})`);
}

await writeIcon(180, "apple-touch-icon.png");
await writeIcon(512, "icon-512.png");
