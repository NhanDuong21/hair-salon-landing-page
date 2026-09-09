# Reproduce Sol's licensed photographs

The seven desktop additions from the 2026-09-10 art direction are separate from these eight approved photographs. Their authoritative manifest is `public/images/motion/sources.json`, with one `.webp.json` source/crop record per export. Run `node scripts/prepare-motion-assets.mjs` to reproduce them: it reuses `assets/motion-originals/` where available, otherwise downloads the seven recorded public Pexels sources, then exports center-cropped WebP quality 82 at the recorded dimensions. Original files and the visual contact sheet are local evidence; source links and the export recipe ship in the repository. Pexels permits website use and modification under its [license](https://www.pexels.com/license/); stock/concept disclosures must stay visible. Total new image payload is 311,566 bytes; mobile/touch does not request these media-qualified sources. The personnel set is unchanged.

The committed `public/images/sources.json`, `refine-assets.json`, and `.webp.json` origin sidecars are authoritative. This script does not read the old selection manifest in `salon-assets/sources.json`, change source claims, or download photos.

Run from the project with dependencies installed and FFmpeg available on `PATH`:

```powershell
node scripts/prepare-assets.mjs "C:/path/to/asset-root" --check
node scripts/prepare-assets.mjs "C:/path/to/asset-root" "C:/path/to/review-output"
```

`--check` generates temporary exports and compares all eight byte for byte against shipping images, without writing to `public/images`. A separate output directory receives the images and exact copies of the current source, crop and origin records. Omitting both the output directory and `--check` regenerates `public/images` while retaining its existing provenance records. Generation is staged before any destination is written.

The asset root must contain these exact original files:

| Relative file | Official photo ID |
|---|---|
| `salon-assets/hero-styling-alternative-original.jpg` | Pexels 29498301 |
| `salon-assets/hair-bob-original.jpg` | Pexels 4927365 |
| `salon-assets/hair-waves-original.jpg` | Pexels 19115784 |
| `salon-assets/hair-color-original.jpg` | Pexels 18939542 |
| `refine-assets/interior-daniel-chair.jpg` | Unsplash Ui6DZ9A1eXU |
| `refine-assets/portrait-10209448.jpg` | Pexels 10209448 |
| `refine-assets/portrait-7760229.jpg` | Pexels 7760229 |
| `refine-assets/portrait-10204120.jpg` | Pexels 10204120 |

The originals used for this refinement are at:

```text
C:/Users/LENOVO/.codex/visualizations/2026/09/07/01a07c7b-db06-7033-831b-290b5206201c
```

The five refined exports follow the recorded crops and output sizes using FFmpeg/libwebp: hero quality 88, interior 84, portraits 86. Minh's recorded scale-then-crop is preserved explicitly. The three hairstyle exports retain Sharp's original 850px-wide, quality 83, effort 6 recipe, including the waves crop. No color filter is applied.

Photo IDs, refined original dimensions and source/license text in sidecars are checked before conversion. New source photos require intentional updates to the recipes, source manifest and provenance together. Byte-identical reproduction also depends on the same original JPEG bytes and converter/library versions; use `--check` after upgrading them.
