import { notFound } from "next/navigation";
import { SiteShell } from "../../components/SiteShell";
import { createPageMetadata } from "../../seo";
import { FamilyStoryView } from "../FamilyStoryView";
import { familyStories, familyStoryPath, getFamilyStory } from "../data";

type FamilyStoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return familyStories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: FamilyStoryPageProps) {
  const { slug } = await params;
  const story = getFamilyStory(slug);
  if (!story) return {};
  return createPageMetadata({ title: story.title, description: story.description, path: familyStoryPath(slug) });
}

export default async function FamilyStoryPage({ params }: FamilyStoryPageProps) {
  const { slug } = await params;
  const story = getFamilyStory(slug);
  if (!story) notFound();

  return <SiteShell><main className="content-main article-main"><FamilyStoryView story={story} /></main></SiteShell>;
}
