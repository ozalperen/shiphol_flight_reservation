import { Request } from 'express';
import { Flight } from '../entities/flights.entity';
import { CreateFlightInput } from '../schemas/flight.schema';
import { AppDataSource } from '../utils/data-source';

const flightRepository = AppDataSource.getRepository(Flight);

export const createFlight = async (input: Partial<Flight>) => {
    return await flightRepository.upsert({ ...input },['scipholid']);

  };

