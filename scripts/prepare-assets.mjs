import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDirectory = process.argv[2];
if (!sourceDirectory)
  throw new Error(
    "Pass the directory containing sources.json and the licensed originals.",
  );
const manifest = JSON.parse(
  await fs.readFile(path.join(sourceDirectory, "sources.json"), "utf8"),
);
const names = [
  "hero",
  "interior",
  "hair-bob",
  "hair-waves",
  "hair-color",
  "stylist-an",
  "stylist-linh",
  "stylist-minh",
];
await fs.mkdir("public/images", { recursive: true });
const sources = [];
for (const [index, asset] of manifest.recommended.entries()) {
  const name = names[index];
  let image = sharp(path.join(sourceDirectory, asset.file)).rotate();
  if (name === "hero")
    image = image.extract({ left: 330, top: 1450, width: 3500, height: 3700 });
  if (name === "hair-waves")
    image = image.extract({ left: 450, top: 300, width: 4400, height: 5650 });
  await image
    .resize({
      width: name === "hero" || name === "interior" ? 1400 : 850,
      withoutEnlargement: true,
    })
    .webp({ quality: 83, effort: 6 })
    .toFile(`public/images/${name}.webp`);
  sources.push({
    file: `/images/${name}.webp`,
    photographer: asset.photographer,
    source: asset.sourcePage,
    license: asset.licenseUrl,
    photoId: asset.photoId,
    use: "Ảnh stock minh họa; không phải nhân sự, khách hàng, tác phẩm hay không gian thật của Nếp.",
  });
}
await fs.writeFile(
  "public/images/sources.json",
  JSON.stringify(
    {
      checkedOn: manifest.checkedOn,
      license: manifest.license,
      images: sources,
    },
    null,
    2,
  ) + "\n",
);
console.log("Prepared", sources.length, "local WebP images.");
