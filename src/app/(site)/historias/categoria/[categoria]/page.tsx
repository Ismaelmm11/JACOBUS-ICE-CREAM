import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STORY_SECTION_TABS } from "@/components/layout/sections";
import { SubNav } from "@/components/layout/SubNav";
import { StoriesListing } from "@/components/stories/StoriesListing";
import { STORY_CATEGORIES, STORY_CATEGORY_LABELS, type StoryCategory } from "@/domain/story";
import { storyRepository } from "@/infrastructure/repositories";
import page from "@/styles/page.module.css";

type Params = Promise<{ categoria: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return STORY_CATEGORIES.map((categoria) => ({ categoria }));
}

function isCategory(value: string): value is StoryCategory {
  return (STORY_CATEGORIES as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { categoria } = await params;
  return isCategory(categoria) ? { title: `${STORY_CATEGORY_LABELS[categoria]} · Historias` } : {};
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { categoria } = await params;
  if (!isCategory(categoria)) notFound();
  const stories = await storyRepository.listByCategory(categoria);

  return (
    <>
      <SubNav title="Historias" items={STORY_SECTION_TABS} />
      <div className={page.container}>
        <h1 className="visually-hidden">Historias: {STORY_CATEGORY_LABELS[categoria]}</h1>
        <StoriesListing stories={stories} />
      </div>
    </>
  );
}
