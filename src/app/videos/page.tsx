import { Metadata } from "next";
import dynamic from "next/dynamic";
const VideosClient = dynamic(() => import("./VideosClient"), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/siteinfo`);
  const data = await res.json();
  return {
    title: data.info?.title || "Videos | Community Group",
    description: data.info?.description || "Community video content and highlights!",
    openGraph: {
      title: data.info?.title || "Videos | Community Group",
      description: data.info?.description || "Community video content and highlights!",
      images: [data.info?.logo || '/profile.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.info?.title || "Videos | Community Group",
      description: data.info?.description || "Community video content and highlights!",
      images: [data.info?.logo || '/profile.png'],
    },
  };
}

export default function VideosPage() {
  return <VideosClient />;
} 