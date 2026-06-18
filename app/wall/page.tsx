import CommunityWall from "@/components/CommunityWall";
import { models } from "@/lib/data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Wall",
  description: "Read real ownership experiences and reviews from verified car owners. No algorithms, just honest feedback on Indian cars.",
  openGraph: {
    title: "Car Owner Reviews & Community Wall — DriveScope",
    description: "Read real ownership experiences and reviews from verified car owners. No algorithms, just honest feedback on Indian cars.",
  }
};

export default function WallPage() {
  const modelOptions = models
    .map((model) => ({ id: model.id, name: model.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return <CommunityWall models={modelOptions} />;
}
