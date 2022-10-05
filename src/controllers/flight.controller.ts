import { NextFunction, Request, Response } from 'express';
import { schipholapiRequest } from '../utils/shipolRequests'
import { GetFlightInput, CreateFlightInput } from '../schemas/flight.schema';
import AppError from '../utils/appError';
import { string } from 'zod';
import  { Flight }  from '../entities/flights.entity';
import { SaveOptions, RemoveOptions } from 'typeorm';
import { createFlight  } from '../services/flight.service'


export class Flights {
  flights: Flightlist[]
}
export class Flightlist {
  flightDirection: string
  flightName: string
  flightNumber: string
  id: string
  route: Route
  scheduleDateTime: Date
  scheduleDate: Date
  scheduleTime: string
}
export class Route {
  destinations: string[]
}

export const getFlightHandler = async (
  req: Request<{}, {}, GetFlightInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const results  = await schipholapiRequest(
      req.body.flightDirection,
      req.body.route,
      req.body.fromScheduleDate,
      req.body.toScheduleDate,
      );
    if (!req.body.flightDirection || !req.body.route || !req.body.fromScheduleDate || !req.body.toScheduleDate) {
        return next(new AppError(400, 'Missing search parameters'));
      }

    const json = results;


      if (!json) {
        return next(new AppError(400, 'No flight has been found with provided search parameters'));
      }
    
    let newFlightList: Flights = await Object.assign(new Flights(), json);

    for (let i = 0; i < newFlightList.flights.length; i++){
      let newfligth = await createFlight({
        route: newFlightList.flights[i].route.destinations,
        flightDirection: newFlightList.flights[i].flightDirection,
        scipholid: newFlightList.flights[i].id,
        flightName: newFlightList.flights[i].flightName,
        flightNumber: newFlightList.flights[i].flightNumber,
        scheduleDate: newFlightList.flights[i].scheduleDate,
        scheduleDateTime: newFlightList.flights[i].scheduleDateTime,
        scheduleTime: newFlightList.flights[i].scheduleTime
      });

    }
   
    res.status(200).json({
      status: 'success',
      data: {
        newFlightList,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

