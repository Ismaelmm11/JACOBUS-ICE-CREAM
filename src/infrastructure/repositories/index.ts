import "server-only";
import type { FlavorRepository, ScheduleRepository } from "@/domain/repositories";
import { JsonFlavorRepository } from "./json/JsonFlavorRepository";
import { JsonScheduleRepository } from "./json/JsonScheduleRepository";

/**
 * Único punto donde se elige la implementación. Para pasar a una API real basta
 * con crear p. ej. ApiFlavorRepository y cambiar esta línea.
 */
export const flavorRepository: FlavorRepository = new JsonFlavorRepository();
export const scheduleRepository: ScheduleRepository = new JsonScheduleRepository();
