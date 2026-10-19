import type { Metadata } from "next";
import { STORY_SECTION_TABS } from "@/components/layout/sections";
import { SubNav } from "@/components/layout/SubNav";
import { StoriesListing } from "@/components/stories/StoriesListing";
import { storyRepository } from "@/infrastructure/repositories";
import page from "@/styles/page.module.css";

export const metadata: Metadata = {
  title: "Historias",
  description: "Sabores nuevos, temporadas, eventos, promos y lo que pasa dentro del obrador.",
};

export default async function HistoriasPage() {
  const stories = await storyRepository.list();
  return (
    <>
      <SubNav title="Historias" titleAs="h1" items={STORY_SECTION_TABS} />
      <div className={page.container}>
        <StoriesListing stories={stories} />
      </div>
    </>
  );
}
