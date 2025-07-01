import ArtClient from "../components/ArtClient";
import { Metadata } from "next";

export default function ArtPage() {
  return <ArtClient />;
}

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/siteinfo`);
  const data = await res.json();
  return {
    title: data.info?.title || "Art | Community Group",
    description: data.info?.description || "Community art gallery and showcase!",
    openGraph: {
      title: data.info?.title || "Art | Community Group",
      description: data.info?.description || "Community art gallery and showcase!",
      images: [data.info?.logo || '/profile.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.info?.title || "Art | Community Group",
      description: data.info?.description || "Community art gallery and showcase!",
      images: [data.info?.logo || '/profile.png'],
    },
  };
} 