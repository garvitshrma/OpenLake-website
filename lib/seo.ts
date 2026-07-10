import type { Metadata } from "next";

export const SITE_NAME = "Hack Club";
export const SITE_TITLE = "OpenLake";
export const SITE_DESCRIPTION =
  "Build. Learn. Contribute. OpenLake is IIT Bhilai's hub for open-source innovation and collaborative development.";
export const SITE_URL = "https://hackclub.com";

type PageMetadataInput = {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  imageAlt?: string;
};

export function buildPageMetadata({
  title,
  description,
  canonical,
  image = "https://cdn.hackclub.com/019db4df-dc7a-7270-94b5-df621a60c7ca/splash.png",
  imageAlt = SITE_NAME,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
