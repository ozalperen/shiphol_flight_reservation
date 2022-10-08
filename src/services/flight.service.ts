import config from "config";
import e, { Request } from "express";
import { Flight } from "../entities/flights.entity";
import { CreateFlightInput } from "../schemas/flight.schema";
import { AppDataSource } from "../utils/data-source";

const flightRepository = AppDataSource.getRepository(Flight);

export const createFlight = async (input: Partial<Flight>) => {
  return await flightRepository.upsert({ ...input }, ["scipholid"]);
};

export const listFlight = async (
  flightDirection: string,
  fromScheduleDate: string,
  toScheduleDate: string,
  route: string
) => {
  const builder = flightRepository.createQueryBuilder("flights");
  builder.where(
    '"flightDirection" = :flightDirection AND "scheduleDate" BETWEEN :fromScheduleDate and :fromScheduleDate AND  :route = ANY(route)',
    {
      flightDirection: flightDirection,
      fromScheduleDate: fromScheduleDate,
      toScheduleDate: toScheduleDate,
      route: route,
    }
  );
  return await builder.getMany();
};


export const getFlight = async (scipholid: string) => {
  return await flightRepository.findOneBy({ scipholid: scipholid });
};

export const getFlightbyId = async (flightId: string) => {
  return await flightRepository.findOneBy({ id: flightId });
};