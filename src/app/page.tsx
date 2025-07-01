import dynamic from "next/dynamic";
import { Metadata } from "next";

const HomeClient = dynamic(() => import("./components/HomeClient"), { ssr: false });

export default function Home() {
  return <HomeClient />;
}

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/siteinfo`);
  const data = await res.json();
  return {
    title: data.info?.title || "Home | Community Group",
    description: data.info?.description || "A modern, open community for sharing, learning, and connecting.",
    openGraph: {
      title: data.info?.title || "Home | Community Group",
      description: data.info?.description || "A modern, open community for sharing, learning, and connecting.",
      images: [data.info?.logo || '/profile.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.info?.title || "Home | Community Group",
      description: data.info?.description || "A modern, open community for sharing, learning, and connecting.",
      images: [data.info?.logo || '/profile.png'],
    },
  };
}
