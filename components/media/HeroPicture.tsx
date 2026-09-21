import { getImageProps } from "next/image";

const DESKTOP_BREAKPOINT = "(min-width: 1024px)";
const DESKTOP_HERO_SIZES = "58vw";
const MOBILE_HERO_SIZES =
  "(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(100vw - 3rem), 58vw";
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

const desktopHero = {
  src: "/images/hero/homepage-fence-with-logo.jpeg",
  width: 1672,
  height: 940,
} as const;

const mobileHero = {
  src: "/images/hero/masterzabor-mobile-hero-1200x750.webp",
  width: 1200,
  height: 750,
} as const;

type HeroPictureProps = {
  alt: string;
  mobile: boolean;
};

export function HeroPicture({ alt, mobile }: HeroPictureProps) {
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    alt,
    height: desktopHero.height,
    sizes: DESKTOP_HERO_SIZES,
    src: desktopHero.src,
    width: desktopHero.width,
  });

  if (!mobile) {
    return (
      <picture>
        <source
          media={DESKTOP_BREAKPOINT}
          sizes={DESKTOP_HERO_SIZES}
          srcSet={desktopSrcSet}
        />
        <img
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
          height={desktopHero.height}
          loading="eager"
          src={TRANSPARENT_PIXEL}
          width={desktopHero.width}
        />
      </picture>
    );
  }

  const { props: mobileProps } = getImageProps({
    alt,
    height: mobileHero.height,
    loading: "eager",
    sizes: MOBILE_HERO_SIZES,
    src: mobileHero.src,
    width: mobileHero.width,
  });

  return (
    <picture>
      <source
        media={DESKTOP_BREAKPOINT}
        sizes={DESKTOP_HERO_SIZES}
        srcSet={desktopSrcSet}
      />
      <img
        {...mobileProps}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
    </picture>
  );
}
