import EcosystemClient from "../components/EcosystemClient";
import { Metadata } from "next";

export default function EcosystemPage() {
  return <EcosystemClient />;
}

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/siteinfo`);
  const data = await res.json();
  return {
    title: data.info?.title || "Ecosystem | Community Group",
    description: data.info?.description || "Explore our community tokens, creators, and projects!",
    openGraph: {
      title: data.info?.title || "Ecosystem | Community Group",
      description: data.info?.description || "Explore our community tokens, creators, and projects!",
      images: [data.info?.logo || '/profile.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.info?.title || "Ecosystem | Community Group",
      description: data.info?.description || "Explore our community tokens, creators, and projects!",
      images: [data.info?.logo || '/profile.png'],
    },
  };
} 