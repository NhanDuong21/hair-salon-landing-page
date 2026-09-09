import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

// See scripts/ASSETS.md for the exact licensed original filenames.
// Usage: node scripts/prepare-assets.mjs <asset-root> [output-directory] [--check]
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const positional = args.filter((arg) => arg !== "--check");
if (!positional[0] || positional.length > 2 || (checkOnly && positional[1])) {
  throw new Error(
    "Usage: node scripts/prepare-assets.mjs <asset-root> [output-directory] [--check]. See scripts/ASSETS.md.",
  );
}
const projectDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sourceDirectory = path.resolve(positional[0]);
const shippingDirectory = path.join(projectDirectory, "public/images");
const destinationDirectory = path.resolve(positional[1] ?? shippingDirectory);
const run = promisify(execFile);
const sourceManifestText = await fs.readFile(
  path.join(shippingDirectory, "sources.json"),
  "utf8",
);
const recipeManifestText = await fs.readFile(
  path.join(shippingDirectory, "refine-assets.json"),
  "utf8",
);
const sourceManifest = JSON.parse(sourceManifestText);
const recipeManifest = JSON.parse(recipeManifestText);

// Photo IDs bind recipes to the current provenance, independent of array order.
const originals = [
  ["hero.webp", 29498301, "salon-assets/hero-styling-alternative-original.jpg", 88],
  ["interior.webp", "Ui6DZ9A1eXU", "refine-assets/interior-daniel-chair.jpg", 84],
  ["stylist-an.webp", 10209448, "refine-assets/portrait-10209448.jpg", 86],
  ["stylist-linh.webp", 7760229, "refine-assets/portrait-7760229.jpg", 86],
  ["stylist-minh.webp", 10204120, "refine-assets/portrait-10204120.jpg", 86],
  ["hair-bob.webp", 4927365, "salon-assets/hair-bob-original.jpg"],
  ["hair-waves.webp", 19115784, "salon-assets/hair-waves-original.jpg"],
  ["hair-color.webp", 18939542, "salon-assets/hair-color-original.jpg"],
];
const assets = [];
for (const [file, photoId, original, quality] of originals) {
  const source = sourceManifest.images.find(
    (entry) => entry.file === `/images/${file}`,
  );
  const recipe = recipeManifest.images.find((entry) => entry.file === file);
  if (
    source?.photoId !== photoId ||
    !source.source ||
    !source.license ||
    (quality && recipe?.photoId !== photoId)
  ) {
    throw new Error(`Recipe/source mismatch for ${file}; review sources.json first.`);
  }
  const input = path.join(sourceDirectory, original);
  const metadata = await sharp(input).metadata();
  if (
    recipe &&
    (metadata.width !== recipe.originalSize[0] ||
      metadata.height !== recipe.originalSize[1])
  ) {
    throw new Error(`${original} does not match the recorded original dimensions.`);
  }
  const provenance = await fs.readFile(
    path.join(shippingDirectory, `${file}.json`),
    "utf8",
  );
  const origin = JSON.parse(provenance).prompt;
  if (!origin?.includes(source.source) || !origin.includes(source.license)) {
    throw new Error(`Missing or stale origin in ${file}.json; refresh provenance first.`);
  }
  assets.push({ file, input, quality, recipe, provenance });
}

// The refined files were authored with FFmpeg. Keep that converter so these
// recipes reproduce the approved exports, including their JPEG decoding.
await run("ffmpeg", ["-version"]);
const stagingDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "sol-assets-"));
try {
  for (const { file, input, quality, recipe } of assets) {
    const output = path.join(stagingDirectory, file);
    if (recipe) {
      const [width, height] = recipe.outputSize;
      let filter;
      if (recipe.cropXYWH) {
        const [left, top, cropWidth, cropHeight] = recipe.cropXYWH;
        filter = `crop=${cropWidth}:${cropHeight}:${left}:${top},scale=${width}:${height}`;
      } else if (
        file === "stylist-minh.webp" &&
        recipe.transform === "Scale to 900x1125, then crop 900x1080 at x0 y0."
      ) {
        filter = "scale=900:1125,crop=900:1080:0:0";
      } else {
        throw new Error(`Unsupported transform for ${file}; update this recipe explicitly.`);
      }
      await run("ffmpeg", [
        "-hide_banner", "-loglevel", "error", "-y", "-i", input,
        "-vf", filter, "-c:v", "libwebp", "-quality", String(quality),
        "-frames:v", "1", output,
      ]);
    } else {
      // Preserve the three original hairstyle recipes and Sharp encoding.
      let image = sharp(input).rotate();
      if (file === "hair-waves.webp") {
        image = image.extract({ left: 450, top: 300, width: 4400, height: 5650 });
      }
      await image
        .resize({ width: 850, withoutEnlargement: true })
        .webp({ quality: 83, effort: 6 })
        .toFile(output);
    }
  }

  if (checkOnly) {
    const mismatches = [];
    for (const { file } of assets) {
      const [generated, shipping] = await Promise.all([
        fs.readFile(path.join(stagingDirectory, file)),
        fs.readFile(path.join(shippingDirectory, file)),
      ]);
      if (!generated.equals(shipping)) mismatches.push(file);
    }
    if (mismatches.length) {
      throw new Error(`Exports differ from shipping files: ${mismatches.join(", ")}. No shipping files changed.`);
    }
    console.log("Verified 8 byte-identical Sol WebP exports. Shipping files unchanged.");
  } else {
    await fs.mkdir(destinationDirectory, { recursive: true });
    for (const { file, provenance } of assets) {
      await fs.copyFile(
        path.join(stagingDirectory, file),
        path.join(destinationDirectory, file),
      );
      if (destinationDirectory !== shippingDirectory) {
        await fs.writeFile(path.join(destinationDirectory, `${file}.json`), provenance);
      }
    }
    if (destinationDirectory !== shippingDirectory) {
      await fs.writeFile(path.join(destinationDirectory, "sources.json"), sourceManifestText);
      await fs.writeFile(path.join(destinationDirectory, "refine-assets.json"), recipeManifestText);
    }
    console.log(`Prepared 8 Sol WebP images in ${destinationDirectory}; current provenance preserved.`);
  }
} finally {
  // Delete only the fixed files this run created, never a computed directory tree.
  for (const { file } of assets) {
    await fs.rm(path.join(stagingDirectory, file), { force: true });
  }
  await fs.rmdir(stagingDirectory);
}
