/* These exports are already cropped and optimized WebP files. A media source
 * prevents mobile/tablet downloads, including the browser's preload scanner. */
const desktop = "(min-width: 1100px) and (hover: hover) and (pointer: fine)";
const empty = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";

export function DesktopPhoto({ src, alt = "", width, height, eager = false }: {
  src: string; alt?: string; width: number; height: number; eager?: boolean;
}) {
  return (
    <picture>
      <source media={desktop} srcSet={src} type="image/webp" />
      <img src={empty} alt={alt} width={width} height={height}
        loading={eager ? "eager" : "lazy"} decoding="async" />
    </picture>
  );
}
