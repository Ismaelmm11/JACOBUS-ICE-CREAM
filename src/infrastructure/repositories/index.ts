import "server-only";
import type { FlavorRepository, ScheduleRepository, StoryRepository } from "@/domain/repositories";
import { JsonFlavorRepository } from "./json/JsonFlavorRepository";
import { JsonScheduleRepository } from "./json/JsonScheduleRepository";
import { JsonStoryRepository } from "./json/JsonStoryRepository";

/**
 * Único punto donde se elige la implementación. Para pasar a una API real basta
 * con crear p. ej. ApiFlavorRepository y cambiar esta línea.
 */
export const flavorRepository: FlavorRepository = new JsonFlavorRepository();
export const scheduleRepository: ScheduleRepository = new JsonScheduleRepository();
export const storyRepository: StoryRepository = new JsonStoryRepository();
