import { EventList } from "@/components/home/EventList";
import { FamilyTiles } from "@/components/home/FamilyTiles";
import { FlavorRail } from "@/components/home/FlavorRail";
import { Headlines } from "@/components/home/Headlines";
import { PromoStrip } from "@/components/home/PromoStrip";
import { StoriesRow } from "@/components/home/StoriesRow";
import { WeekHours } from "@/components/home/WeekHours";
import { StoryCard } from "@/components/stories/StoryCard";
import type { FlavorCardData } from "@/components/ui/FlavorCard";
import { ProgressCarousel, type CarouselSlide } from "@/components/ui/ProgressCarousel";
import { SectionCard } from "@/components/ui/SectionCard";
import type { Flavor } from "@/domain/flavor";
import { STORY_CATEGORY_LABELS, type Story } from "@/domain/story";
import { flavorRepository, scheduleRepository, storyRepository } from "@/infrastructure/repositories";
import styles from "./page.module.css";

// Los eventos «próximos» dependen de la fecha: se regenera cada hora.
export const revalidate = 3600;

function toSlide(story: Story): CarouselSlide {
  return {
    id: story.slug,
    kicker: STORY_CATEGORY_LABELS[story.category],
    title: story.heroTitle,
    text: story.excerpt,
    cta: { label: "Leer la historia", href: `/historias/${story.slug}` },
    family: story.family,
    art: story.art,
  };
}

function toCardData(flavor: Flavor): FlavorCardData {
  const { slug, name, family, prices, stock, vegan, lactoseFree } = flavor;
  return { slug, name, family, prices, stock, vegan, lactoseFree };
}

export default async function HomePage() {
  const [featured, stories, snaps, mostOrdered, newest, flavors, events, hours, timezone] = await Promise.all([
    storyRepository.listFeatured(),
    storyRepository.list(),
    storyRepository.listSnaps(),
    flavorRepository.listMostOrdered(10),
    flavorRepository.getNewest(),
    flavorRepository.list(),
    scheduleRepository.listUpcomingEvents(new Date()),
    scheduleRepository.getWeeklyHours(),
    scheduleRepository.getTimezone(),
  ]);

  const heroSlides = featured.slice(0, 5).map(toSlide);
  const featuredSlugs = new Set(heroSlides.map((s) => s.id));
  const [lead, ...others] = stories.filter((s) => !featuredSlugs.has(s.slug));
  const rest = others.slice(0, 3);

  return (
    <div className={styles.home}>
      <h1 className="visually-hidden">Jacobus Ice Cream, helados de barrio en Elda</h1>

      <div className={styles.split}>
        <div className={styles.main}>
          <ProgressCarousel slides={heroSlides} label="Historias destacadas" titleStyle="display" />
        </div>
        <SectionCard
          id="lo-ultimo"
          title="Lo último"
          action={{ href: "/historias", label: "Todo" }}
          className={styles.aside}
        >
          <Headlines stories={stories.slice(0, 6)} />
        </SectionCard>
      </div>

      <StoriesRow snaps={snaps} label="Stories de la vitrina" />

      <SectionCard id="lo-mas-pedido" title="Lo más pedido" action={{ href: "/sabores", label: "Todos los sabores" }}>
        <FlavorRail flavors={mostOrdered.map(toCardData)} label="Lo más pedido" newSlug={newest?.slug} />
      </SectionCard>

      <div className={styles.split}>
        <SectionCard
          id="historias"
          title="Historias"
          action={{ href: "/historias", label: "Ver todas" }}
          className={styles.main}
        >
          <div className={styles.stories}>
            {lead ? <StoryCard story={lead} variant="lead" /> : null}
            <div className={styles.storyList}>
              {rest.map((story) => (
                <StoryCard key={story.slug} story={story} variant="compact" />
              ))}
            </div>
          </div>
        </SectionCard>

        <div className={styles.aside}>
          <SectionCard id="eventos" title="Próximos eventos" action={{ href: "/visitanos", label: "Visítanos" }}>
            <EventList events={events.slice(0, 3)} />
          </SectionCard>
          <SectionCard id="horario" title="Horario">
            <WeekHours hours={hours} timezone={timezone} />
          </SectionCard>
        </div>
      </div>

      <PromoStrip
        sticker="Martes de tarrina"
        title="La tarrina M te sale a precio de S"
        text="Todos los martes de octubre y noviembre. Mezcla hasta tres sabores. Sin letra pequeña."
        cta={{ label: "Ver la carta", href: "/carta" }}
      />

      <SectionCard id="familias" title="Sabores por familia" action={{ href: "/sabores", label: "Todos" }}>
        <FamilyTiles flavors={flavors} />
      </SectionCard>
    </div>
  );
}
