import { NextFunction, Request, Response } from "express";
import {
  schipholapiSearchRequest,
  schipholapiIdRequest,
} from "../utils/shipolRequests";
import {
  GetFlightInput,
  CreateFlightInput,
  GetFlightbyIdInput,
} from "../schemas/flight.schema";
import AppError from "../utils/appError";
import { string } from "zod";
import { ScipholFlights, Flightlist, Route } from "../entities/flights.entity";
import { SaveOptions, RemoveOptions } from "typeorm";
import {
  createFlight,
  listFlight,
  getFlight,
} from "../services/flight.service";

export const getFlightHandler = async (
  req: Request<{}, {}, GetFlightInput>,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.body.flightDirection ||
    !req.body.route ||
    !req.body.fromScheduleDate ||
    !req.body.toScheduleDate
  ) {
    return next(
      new AppError(
        400,
        "Missing search parameters please select flightDirection, route, fromScheduleDate and toScheduleDate"
      )
    );
  }

  const todate = new Date(req.body.toScheduleDate);
  const fromdate = new Date(req.body.fromScheduleDate);
  if (todate.valueOf() - fromdate.valueOf() > 172800000) {
    return next(
      new AppError(
        400,
        "The date interval is not valid. Allowed days between the from and to dates is 3"
      )
    );
  }
  if (todate.valueOf() < fromdate.valueOf()) {
    return next(
      new AppError(
        400,
        "The date interval is not valid. fromScheduleDate must be a date before toScheduleDate"
      )
    );
  }
  try {
    const results = await schipholapiSearchRequest(
      req.body.flightDirection,
      req.body.route,
      req.body.fromScheduleDate,
      req.body.toScheduleDate
    );

    const json = results;

    if (!json) {
      return next(
        new AppError(
          204,
          "No flight has been found with provided search parameters"
        )
      );
    }

    let newFlightList: ScipholFlights = Object.assign(
      new ScipholFlights(),
      json
    );

    for (let i = 0; i < newFlightList.flights.length; i++) {
      let newfligth = await createFlight({
        route: newFlightList.flights[i].route.destinations,
        flightDirection: newFlightList.flights[i].flightDirection,
        scipholid: newFlightList.flights[i].id,
        flightName: newFlightList.flights[i].flightName,
        flightNumber: newFlightList.flights[i].flightNumber,
        scheduleDate: newFlightList.flights[i].scheduleDate,
        scheduleDateTime: newFlightList.flights[i].scheduleDateTime,
        scheduleTime: newFlightList.flights[i].scheduleTime,
      });
    }

    const cachedFlights = await listFlight(
      req.body.flightDirection,
      req.body.fromScheduleDate,
      req.body.toScheduleDate,
      req.body.route
    );

    res.status(200).json({
      status: "success",
      data: {
        cachedFlights,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getFlightbyIdHandler = async (
  req: Request<GetFlightbyIdInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await schipholapiIdRequest(req.params.scipholid);

    const json = results;

    if (!json) {
      return next(
        new AppError(204, "No flight has been found with provided ID")
      );
    }

    let newFlight: Flightlist = Object.assign(new Flightlist(), json);
    const detailedFlightInfo = newFlight;
    let sFligth = await createFlight({
      route: newFlight.route.destinations,
      flightDirection: newFlight.flightDirection,
      scipholid: newFlight.id,
      flightName: newFlight.flightName,
      flightNumber: newFlight.flightNumber,
      scheduleDate: newFlight.scheduleDate,
      scheduleDateTime: newFlight.scheduleDateTime,
      scheduleTime: newFlight.scheduleTime,
    });
    const flightInfo = await getFlight(req.params.scipholid);

    res.status(200).json({
      status: "success",
      data: {
        flightInfo,
        detailedFlightInfo,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
